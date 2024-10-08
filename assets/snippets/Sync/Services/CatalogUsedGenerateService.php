<?php

namespace EvolutionCMS\Snippets\Sync\Services;

class CatalogUsedGenerateService extends AbstractService
{
    /**
     * @var int
     */
    protected int $tv_id = 77;

    /**
     * @var int
     */
    protected int $catalog_id = 279719;

    /**
     * @var string
     */
    protected string $catalog_file = "catalog-used.json";

    public function __construct()
    {
        parent::__construct();

        unset($_SESSION[__CLASS__.".brands"]);
        unset($_SESSION[__CLASS__.".models"]);
    }

    /**
     * @return array
     */
    protected function getCatalogData(): array
    {
        $models = $this->evo->runSnippet("DocLister", [
            'api' => 1,
            'parents' => $this->catalog_id,
            'depth' => 5,
            'addWhereList' => "c.template = 20 and c.isfolder = 0",
            'tvList' => "car_modifications,model_full_title,mark_id,model_id,car_photos,old-car-price,generation",
            'showParent' => -1
        ]);
        return json_decode($models, true);
    }

    /**
     * @param  array  $item
     * @return array
     */
    protected function params(array $item): array
    {
        $modifications = json_decode((string) $item['tv_car_modifications'], true);

        foreach ($modifications as $modification) {
            foreach ($modification['items'] as $item_key => $item_value) {
                if (strpos($item_key, "ModificationItem") !== false) {
                    $title = "{$item['tv_model_full_title']} {$item_value['value']}";
                    $price = $item_value['items']['price']['value'];
                    $price = (int) preg_replace('/[^0-9]/', '', $price);

                    $this->create([
                        'pagetitle' => $title,
                        'menutitle' => $title,
                        'template' => 28,
                        'parent' => $item['id'],
                        'mark_id' => $item['tv_mark_id'],
                        'model_id' => $item['tv_model_id'],
                        'car_id_old' => "",
                        'car-price' => $price,
                        'old-car-price' => $item['tv_old-car-price'],
                        //'body_type' => $item['body_name'],
                        //'doors-count' => $item['doors'],
                        'modification' => $modification['value'],
                        'complectation' => $item_value['value'],
                        //'owners' => $item['Владельцев'],
                        //'run' => $item['Пробег'],
                        //'year' => $item['Год выпуска'],
                        //'vin' => $item['VIN'],
                        'generation' => $item['tv_generation'],
                        'engine_volume' => (string) $modification['items']['engine_volume']['value'],
                        'engine_power' => (string) $modification['items']['engine_power']['value'],
                        'engine_type' => (string) $modification['items']['engine_type']['value'],
                        'drive' => (string) $modification['items']['drive']['value'],
                        'gear' => (string) $modification['items']['gear']['value'],
                        'acceleration' => (string) $modification['items']['acceleration']['value'],
                        'car_photos' => $item['tv_car_photos'],
                    ]);
                }
            }
        }

        return [];
    }

    /**
     * @return array
     */
    protected function getProductIds(): array
    {
        return [];
    }

    /**
     * @param  array  $params
     * @param  bool  $events
     * @param  bool  $cache
     * @return int
     */
    protected function create(array $params, bool $events = true, bool $cache = false): int
    {
        return parent::create($params, false, false); // TODO: Change the autogenerated stub
    }

    /**
     * @param  int  $id
     * @param  array  $params
     * @param  bool  $events
     * @param  bool  $cache
     * @return void
     */
    protected function update(int $id, array $params, bool $events = true, bool $cache = false): void
    {
        parent::update($id, $params, false, false); // TODO: Change the autogenerated stub
    }
}
