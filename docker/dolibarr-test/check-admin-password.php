#!/usr/bin/env php
<?php
if (!defined('NOSESSION')) {
    define('NOSESSION', '1');
}
define('EVEN_IF_ONLY_LOGIN_ALLOWED', 1);

require_once '/var/www/htdocs/master.inc.php';
require_once DOL_DOCUMENT_ROOT . '/user/class/user.class.php';
require_once DOL_DOCUMENT_ROOT . '/core/lib/security2.lib.php';

global $db;

$login = isset($argv[1]) ? $argv[1] : 'admin';
$password = isset($argv[2]) ? $argv[2] : 'admin_test_pw';

$targetUser = new User($db);
$targetUser->fetch(0, $login);

$result = checkLoginPassEntity($login, $password, array(0, 1), array('dolibarr'));

var_dump($result);
