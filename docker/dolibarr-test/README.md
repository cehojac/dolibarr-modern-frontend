# Dolibarr de test (Docker) para E2E

Entorno Dolibarr aislado y desechable para ejecutar los tests de Playwright, con datos dummy generados por script (no producción).

## 1. Levantar el contenedor

`playwright.config.ts` incluye un `webServer` que ejecuta `docker compose up` automáticamente
al lanzar `npm run test:e2e`. Si el contenedor ya está corriendo (`reuseExistingServer: true`),
no lo relanza; si está parado, lo arranca y espera hasta que responda en `http://localhost:8080`
(hasta 3 minutos, útil para la instalación automática la primera vez).

También puedes levantarlo manualmente:

```powershell
docker compose -f docker/dolibarr-test/docker-compose.yml up -d
```

- Dolibarr quedará disponible en `http://localhost:8080`.
- La instalación es automática (`DOLI_INSTALL_AUTO=1`) con datos demo básicos (`DOLI_INIT_DEMO=1`) y los módulos `Societe, Ticket, Projet, Agenda, Api, Contact` habilitados.
- Usuario admin por defecto: `admin` / `admin_test_pw` (ver `docker-compose.yml` para cambiarlo).

Espera 1-2 minutos a que termine la instalación automática antes de continuar (revisa logs con `docker logs -f dolibarr-test`).

## 2. Generar la clave API de administrador

1. Entra a `http://localhost:8080` con `admin` / `admin_test_pw`.
2. Ve a **Inicio > Configuración > Módulos > API/Web services REST** y verifica que el módulo API está activo.
3. Ve a **Inicio > Configuración > Usuarios > admin > pestaña "Claves de acceso"** (o similar según versión) y genera/copia la clave API.

## 3. Ejecutar el seed de datos dummy

```powershell
$env:DOLIBARR_TEST_BASE_URL="http://localhost:8080/api/index.php"
$env:DOLIBARR_TEST_API_KEY="<pega-tu-clave-api>"
npm run seed:dolibarr
```

Esto crea:
- Usuario de test (`E2E_TEST_USER_LOGIN` / `E2E_TEST_USER_PASSWORD`, por defecto `e2e_test_user` / `e2e_test_password`).
- Un tercero dummy ("E2E Test Client").
- Un ticket, un proyecto, una tarea y una intervención vinculada al ticket.

El script es tolerante a fallos: si algo ya existe o falla puntualmente, se registra un aviso (`⚠️`) y continúa con el resto.

## 4. Apuntar el frontend al Dolibarr de test

En tu `.env` (Laravel) de desarrollo, usa temporalmente:

```
DOLIBARR_BASE_URL=http://localhost:8080/api/index.php
DOLIBARR_API_KEY=<clave-api-del-usuario-e2e-o-admin>
```

Y en `.env.testing` (Playwright, ver `.env.testing.example`):

```
E2E_BASE_URL=http://localhost:8000
E2E_USER_LOGIN=e2e_test_user
E2E_USER_PASSWORD=e2e_test_password
```

## 5. Apagar / limpiar

```powershell
docker compose -f docker/dolibarr-test/docker-compose.yml down -v
```

`-v` elimina también los volúmenes (base de datos y documentos), dejando el entorno completamente limpio para la próxima vez.

## Notas sobre email (Mailtrap)

El envío de correo desde este Dolibarr de test debe configurarse manualmente en
**Inicio > Configuración > Emails**, apuntando al SMTP de Mailtrap (host/puerto/usuario/password
de tu sandbox). Así ningún test dispara emails reales; todo queda capturado en Mailtrap.
