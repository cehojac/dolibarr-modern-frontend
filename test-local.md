# 🧪 Test Local - Dolibarr Modern Frontend

## Pasos para probar localmente:

### 1. Configurar entorno
```bash
# Copiar configuración local
copy .env.local .env

# Editar .env con tus datos reales:
# DOLIBARR_BASE_URL=https://tu-dolibarr.com/api/index.php
# DOLIBARR_API_KEY=tu_api_key_real
```

### 2. Generar clave de aplicación
```bash
php artisan key:generate
```

### 3. Crear base de datos SQLite
```bash
# Crear directorio si no existe
mkdir database

# Crear archivo de base de datos
type nul > database\database.sqlite
```

### 4. Ejecutar migraciones
```bash
php artisan migrate
```

### 5. Compilar assets
```bash
npm run build
```

### 6. Iniciar servidor
```bash
php artisan serve
```

### 7. Abrir en navegador
- URL: http://localhost:8000
- Abrir DevTools (F12) para ver logs de debug

## Debug esperado:

Al cargar la página deberías ver en la consola:
1. `🚀 App iniciándose...`
2. `📊 Estado después de inicializar:`
3. `🔐 Verificando menú "Terceros":` (y otros menús)

## Problemas comunes:

### Si no aparece el menú después de F5:
1. Verificar que los permisos se guardan en localStorage
2. Verificar que se restauran correctamente
3. Verificar que la sesión del servidor sigue activa

### Si los permisos no se cargan:
1. Verificar conexión a Dolibarr
2. Verificar API key válida
3. Verificar CORS configurado correctamente
