<?php
$loader = function($class) {
    static $classes = null;
    if ($classes === null) {
        $classes = array(
            'DLTemplate' => '/../../snippets/DocLister/lib/DLTemplate.class.php',
            'modResource' => '/../../lib/MODxAPI/modResource.php',
            'EvolutionCMS\\Snippets\\Sync\\Controllers\\Controller' => '/Controllers/Controller.php',
            'EvolutionCMS\\Snippets\\Sync\\Services\\AbstractService' => '/Services/AbstractService.php',
            'EvolutionCMS\\Snippets\\Sync\\Services\\CatalogNewService' => '/Services/CatalogNewService.php',
            'EvolutionCMS\\Snippets\\Sync\\Services\\CatalogUsedService' => '/Services/CatalogUsedService.php',
            'EvolutionCMS\\Snippets\\Sync\\Services\\CatalogUsedGenerateService' => '/Services/CatalogUsedGenerateService.php',
        );
    }
    if (isset($classes[$class])) {
        require __DIR__ . $classes[$class];
    }
};
spl_autoload_register($loader, true);
