<?php

namespace App\Console\Commands;

use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class TestPreloadEndpoints extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:preload-endpoints
        {--login= : Dolibarr login/username}
        {--password= : Dolibarr password}
        {--base-url= : API base URL (defaults to APP_URL)}
        {--timeout=15 : Request timeout in seconds}
    ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Smoke test for the endpoints used during the login preload process.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $login = $this->option('login') ?? env('TEST_LOGIN');
        $password = $this->option('password') ?? env('TEST_PASSWORD');
        $baseUrl = rtrim($this->option('base-url') ?? config('app.url', 'http://localhost'), '/');
        $timeout = (int) $this->option('timeout');

        if (!$login) {
            $login = $this->ask('Login (Dolibarr username)');
        }

        if (!$password) {
            $password = $this->secret('Password');
        }

        if (!$login || !$password) {
            $this->error('Login and password are required to run the test.');
            return self::FAILURE;
        }

        $this->info("Running preload endpoint smoke test against {$baseUrl}");

        $cookieJar = new CookieJar();

        $client = Http::baseUrl($baseUrl)
            ->timeout($timeout)
            ->retry(2, 500)
            ->acceptJson()
            ->withHeaders([
                'X-Requested-With' => 'XMLHttpRequest',
                'Referer' => $baseUrl . '/',
            ])
            ->withOptions(['cookies' => $cookieJar]);

        $xsrfToken = $this->fetchXsrfToken($client, $cookieJar);

        if (!$xsrfToken) {
            $this->warn('⚠️  Could not retrieve CSRF token. The login request may fail if CSRF protection is enforced.');
        }

        $loginRequest = $client;

        if ($xsrfToken) {
            $loginRequest = $loginRequest->withHeaders([
                'X-XSRF-TOKEN' => $xsrfToken,
            ]);
        }

        $loginResponse = $loginRequest->asJson()->post('/api/auth/login', [
            'login' => $login,
            'password' => $password,
        ]);

        if ($loginResponse->status() === 419) {
            $this->warn('⚠️  Login POST returned 419 (CSRF). Trying GET fallback...');

            $loginResponse = $client->get('/api/auth/login', [
                'login' => $login,
                'password' => $password,
            ]);
        }

        if ($loginResponse->failed()) {
            $status = $loginResponse->status();
            $message = $this->extractMessage($loginResponse->json());
            $this->error("Login failed (status {$status}) " . ($message ? "- {$message}" : ''));
            return self::FAILURE;
        }

        $user = $loginResponse->json('user', []) ?? [];
        $this->info('✅ Login successful. Session cookie stored.');

        $permissionsResponse = $client->get('/api/auth/permissions');
        if ($permissionsResponse->failed()) {
            $status = $permissionsResponse->status();
            $message = $this->extractMessage($permissionsResponse->json());
            $this->error("Failed to fetch permissions (status {$status}) " . ($message ? "- {$message}" : ''));
            return self::FAILURE;
        }

        $permissions = (array) $permissionsResponse->json('permissions', []);
        $this->info('✅ Permissions loaded: ' . count($permissions));

        $userIdentifiers = $this->extractUserIdentifiers($user);

        $resources = collect([
            [
                'key' => 'thirdparties',
                'label' => 'Terceros',
                'permissions' => ['societe->lire'],
                'builder' => fn () => [
                    'method' => 'get',
                    'url' => '/api/doli/thirdparties',
                    'options' => [
                        'query' => [
                            'limit' => 50,
                            'status' => 1,
                        ],
                    ],
                ],
            ],
            [
                'key' => 'categories',
                'label' => 'Categorías',
                'permissions' => ['categorie->lire', 'projet->lire'],
                'builder' => fn () => [
                    'method' => 'get',
                    'url' => '/api/doli/categories',
                    'options' => [
                        'query' => [
                            'type' => 'project',
                            'limit' => 200,
                        ],
                    ],
                ],
            ],
            [
                'key' => 'projects',
                'label' => 'Proyectos',
                'permissions' => ['projet->lire'],
                'builder' => fn () => [
                    'method' => 'get',
                    'url' => '/api/doli/projects',
                    'options' => [
                        'query' => [
                            'limit' => 200,
                            'sortfield' => 'datec',
                            'sortorder' => 'DESC',
                        ],
                    ],
                ],
            ],
            [
                'key' => 'tickets',
                'label' => 'Tickets asignados',
                'permissions' => ['ticket->lire', 'ticket->read', 'tickets->lire', 'tickets->read'],
                'requires_user' => true,
                'builder' => function (array $userIdentifiers) {
                    if (!$userIdentifiers['id'] && !$userIdentifiers['login']) {
                        return null;
                    }

                    $clauses = [];

                    if ($userIdentifiers['id']) {
                        $clauses[] = "(t.fk_user_assign:=:{$userIdentifiers['id']})";
                    }

                    if ($userIdentifiers['login']) {
                        $sanitized = $this->sanitizeSqlValue($userIdentifiers['login']);
                        $clauses[] = "(t.fk_user_assign_login:=:'{$sanitized}')";
                    }

                    $clauses[] = '(t.fk_statut:<>:8)';

                    return [
                        'method' => 'get',
                        'url' => '/api/doli/tickets',
                        'options' => [
                            'query' => array_filter([
                                'limit' => 200,
                                'sortfield' => 'datec',
                                'sortorder' => 'DESC',
                                'sqlfilters' => $clauses ? implode('and', $clauses) : null,
                            ]),
                        ],
                    ];
                },
            ],
            [
                'key' => 'tasks',
                'label' => 'Tareas asignadas',
                'permissions' => ['projet->lire', 'task->lire', 'task->read'],
                'requires_user' => true,
                'builder' => function (array $userIdentifiers) {
                    if (!$userIdentifiers['id'] && !$userIdentifiers['login']) {
                        return null;
                    }

                    $clauses = ['(t.progress:<:100)or(t.progress:is:null)'];

                    if ($userIdentifiers['id']) {
                        $clauses[] = "(t.fk_user_assign:=:{$userIdentifiers['id']})";
                    } elseif ($userIdentifiers['login']) {
                        $sanitized = $this->sanitizeSqlValue($userIdentifiers['login']);
                        $clauses[] = "(t.fk_user_assign_login:=:'{$sanitized}')";
                    }

                    return [
                        'method' => 'get',
                        'url' => '/api/doli/tasks',
                        'options' => [
                            'query' => [
                                'limit' => 500,
                                'sortfield' => 'dateo',
                                'sortorder' => 'DESC',
                                'sqlfilters' => implode('and', $clauses),
                            ],
                        ],
                    ];
                },
            ],
        ]);

        $results = new Collection();

        foreach ($resources as $resource) {
            $label = $resource['label'];
            $requiredPermissions = $resource['permissions'] ?? [];

            if (!$this->hasAnyPermission($permissions, $requiredPermissions)) {
                $this->warn("⚠️  {$label}: omitido (no tiene permisos requeridos)");
                $results->push([
                    'label' => $label,
                    'status' => 'skipped',
                    'reason' => 'missing_permission',
                    'required' => implode(', ', $requiredPermissions),
                ]);
                continue;
            }

            if (($resource['requires_user'] ?? false) && !$this->hasUserIdentifiers($userIdentifiers)) {
                $this->warn("⚠️  {$label}: omitido (no se detectó ID o login del usuario)");
                $results->push([
                    'label' => $label,
                    'status' => 'skipped',
                    'reason' => 'missing_user',
                ]);
                continue;
            }

            $builder = $resource['builder'];
            $request = $builder($userIdentifiers);

            if (!$request) {
                $this->warn("⚠️  {$label}: omitido (no se pudo construir la solicitud)");
                $results->push([
                    'label' => $label,
                    'status' => 'skipped',
                    'reason' => 'no_request',
                ]);
                continue;
            }

            $method = strtolower($request['method'] ?? 'get');
            $url = $request['url'] ?? '';
            $options = $request['options'] ?? [];

            $this->line("➡️  {$label} ({$url})...");

            try {
                $response = $client->{$method}($url, $options['query'] ?? []);
            } catch (\Throwable $exception) {
                $this->error("❌ {$label}: error al ejecutar la solicitud - {$exception->getMessage()}");
                $results->push([
                    'label' => $label,
                    'status' => 'error',
                    'message' => $exception->getMessage(),
                ]);
                continue;
            }

            if ($response->successful()) {
                $count = count($this->normalizeCollection($response->json()));
                $this->info("✅ {$label}: {$count} registros");
                $results->push([
                    'label' => $label,
                    'status' => 'success',
                    'count' => $count,
                ]);
            } else {
                $status = $response->status();
                $message = $this->extractMessage($response->json());
                $this->error("❌ {$label}: fallo con status {$status}" . ($message ? " - {$message}" : ''));
                $results->push([
                    'label' => $label,
                    'status' => 'error',
                    'status_code' => $status,
                    'message' => $message,
                ]);
            }
        }

        $this->line('\n📊 Resumen:');
        foreach ($results as $result) {
            $label = $result['label'];
            switch ($result['status']) {
                case 'success':
                    $this->line("  ✅ {$label}: {$result['count']} registros");
                    break;
                case 'skipped':
                    $reason = $result['reason'] ?? 'omitido';
                    if ($reason === 'missing_permission' && isset($result['required'])) {
                        $reason .= " ({$result['required']})";
                    }
                    $this->line("  ⚠️  {$label}: omitido ({$reason})");
                    break;
                default:
                    $message = $result['message'] ?? 'Error desconocido';
                    $status = $result['status_code'] ?? 'n/a';
                    $this->line("  ❌ {$label}: error (status {$status}) - {$message}");
                    break;
            }
        }

        $hasErrors = $results->contains(fn ($result) => $result['status'] === 'error');

        if ($hasErrors) {
            $this->error('\n❌ Smoke test completed with errors.');
            return self::FAILURE;
        }

        $this->info('\n✅ Smoke test completed without fatal errors.');
        return self::SUCCESS;
    }

    private function extractMessage($payload): ?string
    {
        if (!$payload) {
            return null;
        }

        if (is_string($payload)) {
            return $payload;
        }

        if (is_array($payload)) {
            return Arr::get($payload, 'message')
                ?? Arr::get($payload, 'error')
                ?? Arr::get($payload, 'errors.0');
        }

        if (is_object($payload) && property_exists($payload, 'message')) {
            return $payload->message;
        }

        return null;
    }

    private function hasAnyPermission(array $permissions, array $required): bool
    {
        if (empty($required)) {
            return true;
        }

        foreach ($required as $permission) {
            if (in_array($permission, $permissions, true)) {
                return true;
            }
        }

        return false;
    }

    private function normalizeCollection($collection): array
    {
        if (is_array($collection)) {
            if ($this->isList($collection)) {
                return $collection;
            }

            if (isset($collection['data']) && is_array($collection['data'])) {
                return $collection['data'];
            }
        }

        return [];
    }

    private function isList(array $array): bool
    {
        return array_keys($array) === range(0, count($array) - 1);
    }

    private function extractUserIdentifiers(array $user): array
    {
        $id = Arr::get($user, 'id')
            ?? Arr::get($user, 'rowid')
            ?? Arr::get($user, 'user_id')
            ?? Arr::get($user, 'userid');

        $login = Arr::get($user, 'login')
            ?? Arr::get($user, 'user');

        return [
            'id' => $id,
            'login' => $login,
        ];
    }

    private function sanitizeSqlValue(?string $value): string
    {
        return str_replace("'", "''", $value ?? '');
    }

    private function hasUserIdentifiers(array $identifiers): bool
    {
        return !empty($identifiers['id']) || !empty($identifiers['login']);
    }

    private function fetchXsrfToken($client, CookieJar $cookieJar): ?string
    {
        $endpoints = [
            '/sanctum/csrf-cookie',
            '/csrf-cookie',
            '/',
            '/login',
            '/api/auth/login',
        ];

        foreach ($endpoints as $endpoint) {
            try {
                $response = $client->get($endpoint);

                if ($response->status() === 405) {
                    // Method not allowed, try POST (some routes expect POST to issue token)
                    $response = $client->post($endpoint);
                }

                if (!$response->successful() && $response->status() !== 422) {
                    continue;
                }

                $token = $this->extractXsrfTokenFromJar($cookieJar);
                if ($token) {
                    return $token;
                }
            } catch (\Throwable $exception) {
                // Ignore and try next endpoint.
                continue;
            }
        }

        return null;
    }

    private function extractXsrfTokenFromJar(CookieJar $cookieJar): ?string
    {
        $cookies = collect($cookieJar->toArray());
        $cookie = $cookies->firstWhere('Name', 'XSRF-TOKEN');

        if (!$cookie) {
            return null;
        }

        $value = Arr::get($cookie, 'Value');

        return $value ? urldecode($value) : null;
    }
}
