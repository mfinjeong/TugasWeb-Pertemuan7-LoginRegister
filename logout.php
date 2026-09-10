<?php
session_start();
$_SESSION = [];
session_destroy();

if (isset($_COOKIE['nexus_user'])) {
    setcookie('nexus_user', '', time() - 3600, '/');
}

header('Location: index.html');
exit;