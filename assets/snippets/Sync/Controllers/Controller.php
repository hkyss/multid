<?php

namespace EvolutionCMS\Snippets\Sync\Controllers;

use EvolutionCMS\Snippets\Sync\Services\CatalogNewService;
use EvolutionCMS\Snippets\Sync\Services\CatalogUsedGenerateService;
use EvolutionCMS\Snippets\Sync\Services\CatalogUsedService;

class Controller
{
    /**
     * @var array
     */
    private static $instances = [];

    /**
     * @throws \Exception
     */
    public function __wakeup()
    {
        throw new \Exception("Cannot unserialize a singleton.");
    }

    /**
     * @param  \DocumentParser  $modx
     * @return Controller
     */
    public static function getInstance(\DocumentParser $modx): Controller
    {
        $cls = static::class;
        if (!isset(self::$instances[$cls])) {
            self::$instances[$cls] = new static($modx);
        }

        return self::$instances[$cls];
    }

    protected function __clone() {}

    /**
     * @param  string  $mode
     * @return string
     */
    public function run(string $mode): string
    {
        switch ($mode) {
            case "catalog-new":
                $service = new CatalogNewService();
                return $service->catalog();
            case "catalog-used":
                $service = new CatalogUsedService();
                return $service->catalog();
            case "catalog-used-generate":
                $service = new CatalogUsedGenerateService();
                return $service->catalog();
            default:
                return "Action not found";
        }
    }
}
