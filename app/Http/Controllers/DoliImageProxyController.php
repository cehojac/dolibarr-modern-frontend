<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DoliImageProxyController extends Controller
{
    public function getImage(Request $request)
    {
        // Obtener parámetros
        $modulepart = $request->query('modulepart', 'mycompany');
        $file = $request->query('file', '');
        
        if (empty($file)) {
            return response()->json(['error' => 'File parameter is required'], 400);
        }
        
        // Obtener URL base de Dolibarr y quitar /api/index.php
        $baseUrl = config('services.dolibarr.base_url');
        $dolibarrBaseUrl = preg_replace('/\/api\/index\.php$/', '', $baseUrl);
        
        // Si el archivo no incluye la carpeta, agregamos logos/thumbs/
        // y el sufijo _small_small.jpg
        if (!str_starts_with($file, 'logos/')) {
            // Extraer nombre base y extensión
            $pathInfo = pathinfo($file);
            $basename = $pathInfo['filename']; // logo-carlos-herrera-2014_small
            $extension = $pathInfo['extension'] ?? 'jpg';
            
            // Construir ruta completa con thumbs y sufijo _small
            $file = 'logos/thumbs/' . $basename . '_small.' . $extension;
        }
        
        // Construir URL de la imagen
        $imageUrl = $dolibarrBaseUrl . '/viewimage.php?cache=1&modulepart=' . urlencode($modulepart) . '&file=' . urlencode($file);
        
        \Log::info('Redirect a imagen Dolibarr', [
            'base_url' => $baseUrl,
            'dolibarr_base_url' => $dolibarrBaseUrl,
            'file_original' => $request->query('file'),
            'file_procesado' => $file,
            'image_url' => $imageUrl
        ]);
        
        // Hacer redirect a la URL de Dolibarr
        // Esto permite que el navegador cargue la imagen directamente
        return redirect($imageUrl);
    }
}
