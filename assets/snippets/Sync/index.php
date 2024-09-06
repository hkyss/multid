<?php
//if (empty($argv) || empty($argv[1]) || empty($argv[2]) || $argv[1] !== "eb5422f94a7d5c8bac72f27d6ee3b96ea257d06d") {
//    die("Error");
//}

$argv[2] = (string) $_GET['action'];

if (empty($argv[2])) {
    die("Error");
}

define('MODX_API_MODE', true);
include_once __DIR__."/../../../index.php";
$modx->db->connect();
if (empty($modx->config)) {
    $modx->getSettings();
}

include_once __DIR__."/__autoload.php";

use EvolutionCMS\Snippets\Sync\Controllers\Controller;

try {
    die(
    Controller::getInstance($modx)
        ->run($argv[2])
    );
} catch (Exception $e) {
    die("Something was wrong");
}
