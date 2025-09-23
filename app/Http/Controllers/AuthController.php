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
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string'
        ]);

        // Obtener credenciales del request (POST del frontend)
        $login = $request->input('login');
        $password = $request->input('password');

        // Autenticar con Dolibarr API usando el endpoint de login estándar
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
                
                // El endpoint /login devuelve directamente el token como string
                $token = is_string($data) ? $data : ($data['success']['token'] ?? $data['token'] ?? null);
                
                Log::info('Login successful, token obtained:', [
                    'has_token' => !empty($token),
                    'token_length' => strlen($token ?? '')
                ]);
                
                
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
                
                // Ahora obtener los permisos usando el endpoint correcto con contraseña
                if (!empty($token)) {
                    try {
                        $permissionsUrl = config('services.dolibarr.base_url') . '/users/login/' . $login . '?includepermissions=1';
                        Log::info('Getting permissions from: ' . $permissionsUrl);
                        
                        // Este endpoint solo requiere la API key
                        $permissionsResponse = PleskHttpClient::withDolibarrApiKey()->get($permissionsUrl);
                        
                        if ($permissionsResponse->successful()) {
                            $permissionsData = $permissionsResponse->json();
                            Log::info('Permissions response structure:', [
                                'response_keys' => array_keys($permissionsData),
                                'has_success' => isset($permissionsData['success']),
                                'success_keys' => isset($permissionsData['success']) ? array_keys($permissionsData['success']) : []
                            ]);
                            
                            // Los permisos están en success.rights
                            $permissions = $permissionsData['success']['rights'] ?? $permissionsData['rights'] ?? [];
                            
                            if (!empty($permissions)) {
                                Log::info('Permissions obtained successfully:', [
                                    'permissions_count' => count($permissions),
                                    'sample_permissions' => array_slice(array_keys($permissions), 0, 5)
                                ]);
                            } else {
                                Log::warning('Permissions endpoint returned empty permissions');
                            }
                        } else {
                            Log::warning('Failed to get permissions: HTTP ' . $permissionsResponse->status() . ' - ' . $permissionsResponse->body());
                        }
                    } catch (\Exception $e) {
                        Log::warning('Failed to get permissions: ' . $e->getMessage());
                    }
                }

                // Almacenar permisos de forma segura en la sesión del servidor
                // Los permisos NO se envían al frontend para evitar manipulación
                $request->session()->put('dolibarr_permissions', $permissions);
                
                // Procesar permisos para logging
                $flatPermissions = $this->flattenPermissions($permissions);
                $activePermissions = array_keys(array_filter($flatPermissions, function($value) {
                    return $value === true || $value === 1 || $value === '1';
                }));
                
                Log::info('Permissions stored in server session:', [
                    'raw_permissions_count' => count($permissions),
                    'flat_permissions_count' => count($flatPermissions),
                    'active_permissions_count' => count($activePermissions),
                    'sample_active_permissions' => array_slice($activePermissions, 0, 10) // Mostrar algunos permisos activos
                ]);
                
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
        
        // Convertir permisos a formato plano
        $flatPermissions = $this->flattenPermissions($permissions);
        
        // Verificar si el usuario tiene el permiso solicitado
        $hasPermission = isset($flatPermissions[$requestedPermission]) && $flatPermissions[$requestedPermission];
        
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
        $permissions = $request->session()->get('dolibarr_permissions', []);
        
        // Procesar permisos anidados de Dolibarr y convertirlos a formato plano
        $flatPermissions = $this->flattenPermissions($permissions);
        
        // Solo devolver los nombres de los permisos que están activos (true)
        $activePermissions = array_keys(array_filter($flatPermissions, function($value) {
            return $value === true || $value === 1 || $value === '1';
        }));
        
        return response()->json([
            'permissions' => $activePermissions,
            'count' => count($activePermissions)
        ]);
    }

    /**
     * Convierte la estructura anidada de permisos de Dolibarr a formato plano
     */
    private function flattenPermissions($permissions, $prefix = '')
    {
        $flat = [];
        
        foreach ($permissions as $key => $value) {
            $fullKey = $prefix ? $prefix . '.' . $key : $key;
            
            if (is_array($value)) {
                // Si es un array, procesar recursivamente
                $flat = array_merge($flat, $this->flattenPermissions($value, $fullKey));
            } else {
                // Si es un valor, agregarlo al array plano
                $flat[$fullKey] = $value;
            }
        }
        
        return $flat;
    }

    public function debugPermissions(Request $request)
    {
        $rawPermissions = $request->session()->get('dolibarr_permissions', []);
        $flatPermissions = $this->flattenPermissions($rawPermissions);
        
        // También probar la llamada directa a Dolibarr
        $directTest = null;
        try {
            $testUrl = config('services.dolibarr.base_url') . '/users/login/ch_admin?includepermissions=1';
            $testResponse = PleskHttpClient::withDolibarrApiKey()->get($testUrl);
            
            $directTest = [
                'url' => $testUrl,
                'status' => $testResponse->status(),
                'successful' => $testResponse->successful(),
                'response_keys' => $testResponse->successful() ? array_keys($testResponse->json()) : null,
                'has_success' => $testResponse->successful() ? isset($testResponse->json()['success']) : false,
                'response_sample' => $testResponse->successful() ? array_slice($testResponse->json(), 0, 3, true) : $testResponse->body()
            ];
        } catch (\Exception $e) {
            $directTest = ['error' => $e->getMessage()];
        }
        
        return response()->json([
            'session_permissions' => [
                'raw_permissions' => $rawPermissions,
                'raw_count' => count($rawPermissions),
                'flat_permissions' => $flatPermissions,
                'flat_count' => count($flatPermissions),
                'active_permissions' => array_keys(array_filter($flatPermissions, function($value) {
                    return $value === true || $value === 1 || $value === '1';
                }))
            ],
            'direct_dolibarr_test' => $directTest
        ]);
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
}
