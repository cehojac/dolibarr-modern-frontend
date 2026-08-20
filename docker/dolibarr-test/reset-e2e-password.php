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
$newPassword = isset($argv[2]) ? $argv[2] : 'e2e_test_password';

$adminUser = new User($db);
$adminUser->fetch(0, 'admin');

$targetUser = new User($db);
$targetUser->fetch(0, $login);

if (empty($targetUser->id)) {
    echo "ERROR: usuario '$login' no encontrado\n";
    exit(1);
}

$res = $targetUser->setPassword($adminUser, $newPassword, 0, 0, 0);

if ($res > 0) {
    echo "OK: password de '$login' actualizada\n";
    exit(0);
}

echo "ERROR: no se pudo actualizar el password (res=$res)\n";
exit(1);
