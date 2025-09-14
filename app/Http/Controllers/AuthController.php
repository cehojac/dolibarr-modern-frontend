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
                
                // Guardar token en sesión
                $request->session()->put('dolibarr_token', $token);
                $request->session()->put('dolibarr_user', [
                    'login' => $login,
                    'firstname' => '',
                    'lastname' => '',
                    'email' => '',
                ]);
                
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
