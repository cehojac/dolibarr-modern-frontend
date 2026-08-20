#!/usr/bin/env php
<?php
// Script temporal para resetear la contraseña del admin en el Dolibarr de test (Docker).
// Uso dentro del contenedor:
//   php /var/www/scripts/reset-admin-password.php <login> <nueva-password>

if (!defined('NOSESSION')) {
    define('NOSESSION', '1');
}
define('EVEN_IF_ONLY_LOGIN_ALLOWED', 1);

require_once '/var/www/htdocs/master.inc.php';
require_once DOL_DOCUMENT_ROOT . '/user/class/user.class.php';

global $db, $user;

$login = isset($argv[1]) ? $argv[1] : 'admin';
$newPassword = isset($argv[2]) ? $argv[2] : 'admin_test_pw';

$targetUser = new User($db);
$result = $targetUser->fetch(0, $login);

if ($result <= 0) {
    echo "ERROR: usuario '$login' no encontrado\n";
    exit(1);
}

$res = $targetUser->setPassword($user, $newPassword, 0, 0, 0);

if ($res > 0) {
    echo "OK: password de '$login' actualizada\n";
    exit(0);
}

echo "ERROR: no se pudo actualizar el password\n";
exit(1);
