# 🔧 Solución Error Tailwind CSS

## Error:
```
[plugin:vite:css] [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
```

## Solución Rápida:

### Opción 1: Ejecutar script automático
```bash
# Ejecutar el script que limpia e instala todo
install-deps.bat
```

### Opción 2: Manual

1. **Limpiar dependencias:**
```bash
rmdir /s /q node_modules
del package-lock.json
```

2. **Reinstalar:**
```bash
npm install
```

3. **Si sigue fallando, usar archivos CommonJS:**
```bash
# Renombrar archivos
ren tailwind.config.js tailwind.config.js.bak
ren tailwind.config.cjs tailwind.config.js

ren postcss.config.js postcss.config.js.bak  
ren postcss.config.cjs postcss.config.js
```

4. **Compilar:**
```bash
npm run build
```

## Verificación:

Después de la solución, deberías poder ejecutar:
```bash
npm run dev
# o
npm run build
```

Sin errores de Tailwind CSS.

## Si persiste el problema:

1. Verificar que tienes Node.js >= 16
2. Verificar que no hay conflictos en package.json
3. Usar la configuración CommonJS (archivos .cjs)

## Archivos importantes:
- `package.json` - Dependencias correctas
- `tailwind.config.js` - Configuración de Tailwind
- `postcss.config.js` - Configuración de PostCSS
- `resources/css/app.css` - CSS principal con directivas @tailwind
