<!DOCTYPE html>
<html>
<head>
    <title>Debug Permissions</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <h1>Debug de Permisos Dolibarr</h1>
    
    <div style="margin: 20px 0;">
        <button onclick="testLogin()" style="margin: 5px; padding: 10px;">1. Test Login</button>
        <button onclick="testDebug()" style="margin: 5px; padding: 10px;">2. Test Debug</button>
        <button onclick="testPermissions()" style="margin: 5px; padding: 10px;">3. Test Permissions</button>
    </div>
    
    <div id="results" style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;"></div>

    <script>
        async function testLogin() {
            try {
                document.getElementById('results').innerHTML = 'Haciendo login...';
                
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify({
                        login: 'ch_admin',
                        password: 'Dolibarr2024!'
                    })
                });
                
                const data = await response.json();
                document.getElementById('results').innerHTML = '<h3>Login Result:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('results').innerHTML = 'Error: ' + error.message;
            }
        }

        async function testDebug() {
            try {
                document.getElementById('results').innerHTML = 'Obteniendo debug de permisos...';
                
                const response = await fetch('/api/auth/debug-permissions');
                const data = await response.json();
                
                let html = '<h3>Debug Permissions:</h3>';
                html += '<h4>Raw Permissions Count: ' + Object.keys(data.raw_permissions || {}).length + '</h4>';
                html += '<h4>Flat Permissions Count: ' + Object.keys(data.flat_permissions || {}).length + '</h4>';
                html += '<h4>Active Permissions Count: ' + (data.active_permissions || []).length + '</h4>';
                
                if (data.active_permissions && data.active_permissions.length > 0) {
                    html += '<h4>Algunos permisos activos:</h4><ul>';
                    data.active_permissions.slice(0, 10).forEach(perm => {
                        html += '<li>' + perm + '</li>';
                    });
                    html += '</ul>';
                }
                
                html += '<details><summary>Ver datos completos</summary><pre>' + JSON.stringify(data, null, 2) + '</pre></details>';
                
                document.getElementById('results').innerHTML = html;
            } catch (error) {
                document.getElementById('results').innerHTML = 'Error: ' + error.message;
            }
        }

        async function testPermissions() {
            try {
                document.getElementById('results').innerHTML = 'Obteniendo permisos del endpoint...';
                
                const response = await fetch('/api/auth/permissions');
                const data = await response.json();
                document.getElementById('results').innerHTML = '<h3>Permissions Endpoint:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('results').innerHTML = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>
