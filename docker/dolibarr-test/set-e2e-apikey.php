#!/usr/bin/env php
<?php
if (!defined('NOSESSION')) {
    define('NOSESSION', '1');
}
define('EVEN_IF_ONLY_LOGIN_ALLOWED', 1);

require_once '/var/www/htdocs/master.inc.php';
require_once DOL_DOCUMENT_ROOT . '/user/class/user.class.php';

global $db;

$login = isset($argv[1]) ? $argv[1] : 'e2e_test_user';
$apiKey = isset($argv[2]) ? $argv[2] : 'e2e_test_api_key_'.bin2hex(random_bytes(8));

$adminUser = new User($db);
$adminUser->fetch(0, 'admin');

$targetUser = new User($db);
$targetUser->fetch(0, $login);

if (empty($targetUser->id)) {
    echo "ERROR: usuario '$login' no encontrado\n";
    exit(1);
}

$targetUser->api_key = $apiKey;

// update() recibe el usuario que realiza la acción (admin)
$res = $targetUser->update($adminUser);

if ($res > 0) {
    echo "OK: api_key de '$login' actualizada a: $apiKey\n";
    exit(0);
}

echo "ERROR: no se pudo actualizar la api_key (res=$res)\n";
exit(1);
