<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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

        // Autenticar con Dolibarr API usando GET con query parameters
        try {
            $response = Http::timeout(10)->get(config('services.dolibarr.base_url') . '/login', [
                'login' => $login,
                'password' => $password
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // La API de Dolibarr devuelve directamente el token como string
                $token = is_array($data) ? ($data['success']['token'] ?? $data) : $data;
                
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
                        $userInfoResponse = Http::withHeaders([
                            'DOLAPIKEY' => $token,
                            'Accept' => 'application/json',
                        ])->get(config('services.dolibarr.base_url') . $endpoint);
                        
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
                        $usersResponse = Http::withHeaders([
                            'DOLAPIKEY' => $token,
                            'Accept' => 'application/json',
                        ])->get(config('services.dolibarr.base_url') . '/users');
                        
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
                
                $request->session()->put('dolibarr_user', [
                    'id' => $userId,
                    'login' => $userInfo['login'] ?? $login,
                    'firstname' => $userInfo['firstname'] ?? $userInfo['name'] ?? '',
                    'lastname' => $userInfo['lastname'] ?? $userInfo['surname'] ?? '',
                    'email' => $userInfo['email'] ?? '',
                    'admin' => $userInfo['admin'] ?? 0,
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

    public function logout(Request $request)
    {
        $request->session()->forget('dolibarr_token');
        $request->session()->forget('dolibarr_user');
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['ok' => true]);
    }
}
