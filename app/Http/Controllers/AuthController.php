<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Http\Clients\PleskHttpClient;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Inicializar sesión manualmente si no existe
        if (!$request->hasSession()) {
            $request->setLaravelSession(app('session.store'));
        }
        
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string'
        ]);

        // Obtener credenciales del request (POST del frontend)
        $login = $request->input('login');
        $password = $request->input('password');

        // Autenticar con Dolibarr API usando GET con query parameters
        try {
            $response = PleskHttpClient::get(config('services.dolibarr.base_url') . '/login', [
                'login' => $login,
                'password' => $password
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Extraer token y permisos de la respuesta
                $token = null;
                $permissions = [];
                
                if (is_array($data)) {
                    // Si la respuesta es un array, buscar token y permisos
                    $token = $data['success']['token'] ?? $data['token'] ?? null;
                    $permissions = $data['success']['permissions'] ?? $data['permissions'] ?? [];
                    
                    // Si no encontramos token en success, buscar en el nivel superior
                    if (!$token) {
                        $token = $data;
                    }
                } else {
                    // Si la respuesta es string, es el token
                    $token = $data;
                }
                
                
                // Intentar obtener información del usuario usando diferentes enfoques
                // Nota: La API login no devuelve ID, necesitamos obtenerlo de otra forma
                $userInfo = [];
                
                try {
                    // Enfoque 1: Intentar obtener el perfil del usuario actual con diferentes endpoints
                    $endpoints = [
                        '/users/info',
                        '/users/0',  // 0 suele representar el usuario actual en muchas APIs
                        '/users/me', // Endpoint común para "mi perfil"
                        '/user',     // Alternativa sin 's'
                        '/profile'   // Otro endpoint común
                    ];
                    
                    $userInfo = [];
                    foreach ($endpoints as $endpoint) {
                        $userInfoResponse = PleskHttpClient::withDolibarrToken($token)->get(config('services.dolibarr.base_url') . $endpoint);
                        
                        if ($userInfoResponse->successful()) {
                            $userInfo = $userInfoResponse->json();
                            Log::info("Got user info from {$endpoint}:", $userInfo);
                            break;
                        } else {
                            Log::info("Failed to get user info from {$endpoint}", [
                                'status' => $userInfoResponse->status(),
                                'response' => $userInfoResponse->body()
                            ]);
                        }
                    }
                    
                    if (empty($userInfo)) {
                        Log::info('Failed to get user info, trying alternative approach', [
                            'status' => $userInfoResponse->status(),
                            'response' => $userInfoResponse->body()
                        ]);
                        
                        // Enfoque 2: Intentar con /users (lista completa) si tiene permisos
                        $usersResponse = PleskHttpClient::withDolibarrToken($token)->get(config('services.dolibarr.base_url') . '/users');
                        
                        if ($usersResponse->successful()) {
                            $users = $usersResponse->json();
                            Log::info('Searching user in users list, total:', count($users));
                            
                            // Buscar por login exacto
                            foreach ($users as $user) {
                                if (isset($user['login']) && $user['login'] === $login) {
                                    $userInfo = $user;
                                    Log::info('Found user by login:', ['login' => $user['login'], 'id' => $user['id'] ?? $user['rowid'] ?? 'NO_ID']);
                                    break;
                                }
                            }
                        } else {
                            Log::warning('Cannot access users API, using fallback approach', [
                                'status' => $usersResponse->status(),
                                'error' => $usersResponse->body()
                            ]);
                            
                            // Enfoque 3: Fallback - usar una ID basada en el login como hash
                            // Esto es temporal hasta encontrar una mejor solución
                            $fallbackId = crc32($login); // Genera un ID numérico basado en el login
                            $userInfo = [
                                'id' => $fallbackId,
                                'login' => $login,
                                'firstname' => '',
                                'lastname' => '',
                                'email' => filter_var($login, FILTER_VALIDATE_EMAIL) ? $login : '',
                                'admin' => 0
                            ];
                            Log::info('Using fallback ID for user:', ['login' => $login, 'fallback_id' => $fallbackId]);
                        }
                    }
                } catch (\Exception $e) {
                    Log::error('Error getting user info: ' . $e->getMessage());
                    // Fallback final
                    $fallbackId = crc32($login);
                    $userInfo = [
                        'id' => $fallbackId,
                        'login' => $login,
                        'firstname' => '',
                        'lastname' => '',
                        'email' => filter_var($login, FILTER_VALIDATE_EMAIL) ? $login : '',
                        'admin' => 0
                    ];
                }
                
                // Guardar token y información completa del usuario en sesión
                $request->session()->put('dolibarr_token', $token);
                
                // Try multiple possible ID field names from Dolibarr API
                $userId = null;
                if (!empty($userInfo)) {
                    $userId = $userInfo['id'] ?? 
                             $userInfo['rowid'] ?? 
                             $userInfo['user_id'] ?? 
                             $userInfo['fk_user'] ?? 
                             null;
                    
                    Log::info('Available user fields:', array_keys($userInfo));
                    Log::info('Extracted user ID:', ['user_id' => $userId]);
                }
                
                // Almacenar datos del usuario en sesión
                $userData = [
                    'id' => $userId,
                    'login' => $userInfo['login'] ?? $login,
                    'firstname' => $userInfo['firstname'] ?? $userInfo['name'] ?? '',
                    'lastname' => $userInfo['lastname'] ?? $userInfo['surname'] ?? '',
                    'email' => $userInfo['email'] ?? '',
                    'admin' => $userInfo['admin'] ?? 0,
                ];
                
                $request->session()->put('dolibarr_user', $userData);
                
                // Obtener permisos usando el endpoint específico con API key
                if (!empty($token)) {
                    try {
                        // Usar el login del usuario y API key para la consulta de permisos
                        $permissionsUrl = config('services.dolibarr.base_url') . '/users/login/' . $login . '?includepermissions=1';
                        
                        $permissionsResponse = PleskHttpClient::withDolibarrApiKey()->get($permissionsUrl);
                        
                        if ($permissionsResponse->successful()) {
                            $permissionsData = $permissionsResponse->json();
                            
                            // Buscar permisos en diferentes ubicaciones de la respuesta
                            $rawPermissions = $permissionsData['rights'] ?? 
                                            $permissionsData['permissions'] ?? 
                                            $permissionsData['success']['rights'] ?? 
                                            $permissionsData['success']['permissions'] ?? 
                                            [];
                            
                            // Debug: mostrar estructura original
                            Log::info('Raw permissions from Dolibarr API: ' . json_encode($rawPermissions));
                            
                            // Procesar estructura anidada de permisos de Dolibarr
                            $permissions = $this->flattenPermissions($rawPermissions);
                            
                            // Debug: mostrar permisos procesados
                            Log::info('Flattened permissions: ' . json_encode($permissions));
                            Log::info('Total permissions count: ' . count($permissions));
                            
                        } else {
                            Log::warning('Error obteniendo permisos: HTTP ' . $permissionsResponse->status());
                        }
                    } catch (\Exception $e) {
                        Log::warning('Excepción obteniendo permisos: ' . $e->getMessage());
                    }
                }
                
                // Almacenar permisos de forma segura en la sesión del servidor
                // Los permisos NO se envían al frontend para evitar manipulación
                $request->session()->put('dolibarr_permissions', $permissions);
                
                
                Log::info('User data stored in session:', $request->session()->get('dolibarr_user'));
                
                return response()->json([
                    'message' => 'Autenticado correctamente',
                    'user' => $request->session()->get('dolibarr_user')
                ]);
            } else {
                return response()->json(['message' => 'Credenciales inválidas'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error de conexión con Dolibarr: ' . $e->getMessage()], 500);
        }
    }

    public function me(Request $request)
    {
        $token = $request->session()->get('dolibarr_token');
        $user = $request->session()->get('dolibarr_user');
        
        return response()->json([
            'authenticated' => (bool) $token,
            'user' => $user
        ]);
    }

    public function checkPermission(Request $request)
    {
        $request->validate([
            'permission' => 'required|string'
        ]);

        $permissions = $request->session()->get('dolibarr_permissions', []);
        $requestedPermission = $request->input('permission');
        
        // Verificar si el usuario tiene el permiso solicitado
        $hasPermission = isset($permissions[$requestedPermission]) && $permissions[$requestedPermission];
        
        Log::info('Permission check:', [
            'permission' => $requestedPermission,
            'has_permission' => $hasPermission,
            'user_id' => $request->session()->get('dolibarr_user.id')
        ]);
        
        return response()->json([
            'permission' => $requestedPermission,
            'granted' => $hasPermission
        ]);
    }

    public function getPermissions(Request $request)
    {
        // Inicializar sesión manualmente si no existe
        if (!$request->hasSession()) {
            $request->setLaravelSession(app('session.store'));
        }
        
        // Debug específico para producción
        Log::info('getPermissions: Iniciando', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'session_id' => $request->session()->getId(),
            'user_agent' => $request->userAgent(),
            'ip' => $request->ip(),
            'headers' => $request->headers->all(),
            'is_api_route' => $request->is('api/*'),
            'has_session' => $request->hasSession()
        ]);
        
        // Verificar si hay sesión activa
        $token = $request->session()->get('dolibarr_token');
        $user = $request->session()->get('dolibarr_user');
        
        if (!$token || !$user) {
            Log::warning('getPermissions: No hay sesión activa', [
                'session_id' => $request->session()->getId(),
                'has_token' => (bool) $token,
                'has_user' => (bool) $user,
                'user_agent' => $request->userAgent(),
                'ip' => $request->ip()
            ]);
            
            return response()->json([
                'error' => 'No hay sesión activa',
                'permissions' => [],
                'count' => 0
            ], 401);
        }
        
        $permissions = $request->session()->get('dolibarr_permissions', []);
        
        // Solo devolver los nombres de los permisos que están activos (true)
        $activePermissions = array_keys(array_filter($permissions, function($value) {
            return $value === true || $value === 1 || $value === '1';
        }));
        
        Log::info('getPermissions: Permisos devueltos', [
            'user_id' => $user['id'] ?? 'unknown',
            'permissions_count' => count($activePermissions),
            'session_id' => $request->session()->getId()
        ]);
        
        return response()->json([
            'permissions' => $activePermissions,
            'count' => count($activePermissions)
        ]);
    }

    public function debugSession(Request $request)
    {
        $sessionData = [
            'session_id' => $request->session()->getId(),
            'has_user' => $request->session()->has('dolibarr_user'),
            'has_permissions' => $request->session()->has('dolibarr_permissions'),
            'user_data' => $request->session()->get('dolibarr_user'),
            'permissions_raw' => $request->session()->get('dolibarr_permissions', []),
            'permissions_count' => count($request->session()->get('dolibarr_permissions', [])),
            'all_session_keys' => array_keys($request->session()->all())
        ];
        
        return response()->json($sessionData);
    }

    public function logout(Request $request)
    {
        $request->session()->forget('dolibarr_token');
        $request->session()->forget('dolibarr_user');
        $request->session()->forget('dolibarr_permissions');
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['ok' => true]);
    }

    /**
     * Convierte la estructura anidada de permisos de Dolibarr a formato plano
     * Ejemplo: ["user" => ["user" => ["lire" => 1]]] → ["user->user->lire" => 1]
     */
    private function flattenPermissions($permissions, $prefix = '')
    {
        $flattened = [];
        
        if (!is_array($permissions)) {
            return $flattened;
        }
        
        foreach ($permissions as $key => $value) {
            $newKey = $prefix ? $prefix . '->' . $key : $key;
            
            if (is_array($value)) {
                // Si es un array, recursivamente aplanar
                $flattened = array_merge($flattened, $this->flattenPermissions($value, $newKey));
            } else {
                // Si es un valor, agregarlo al array plano
                $flattened[$newKey] = $value;
            }
        }
        
        return $flattened;
    }
}
