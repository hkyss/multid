<?php

namespace EvolutionCMS\Snippets\Sync\Services;

class CatalogUsedService extends AbstractService
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
     * @return string
     */
    public function catalog(): string
    {
        $catalog = $this->getCatalogData();

        if (empty($catalog)) {
            return 'Empty catalog';
        }

        $ids = $this->getProductIds();

        foreach ($catalog as $item) {
            $item_key_id = $this->getItemKeyId();
            $id_old = $item[$item_key_id];
            $params = $this->params($item);

            if (empty($params)) {
                continue;
            }

            if (empty($ids[$id_old])) {
                $this->create($params);
            } else {
                $this->update($ids[$id_old], $params);
            }
        }

        return 'Done!';
    }

    /**
     * @param  array  $item
     * @return array
     */
    protected function params(array $item): array
    {
        $brand = (string) $item['brand_name'];
        $model = (string) $item['model_name'];
        $modification = (string) $item['Модификация'];

        $complectations = (array) $item['Комплектация'];
        $complectation = array_key_first($complectations);

        $title = "{$brand} {$model} {$modification}";
        $brand_lower = mb_strtolower($brand);
        $model_lower = mb_strtolower($model);

        $model_id = $_SESSION[__CLASS__.".models"]["{$brand_lower}-{$model_lower}"];

        if (empty($model_id)) {
            return [];
        }

        $price = $item['price_with_discount'];
        $price_old = $item['base_price'];

        if (empty($price)) {
            $price = $item['base_price'];
            $price_old = 0;
        }

        return [
            'pagetitle' => $title,
            'menutitle' => $title,
            'template' => 28,
            'parent' => $model_id,
            'mark_id' => $brand,
            'model_id' => $model,
            'car_id_old' => $item['car_id'],
            'car-price' => $price,
            'old-car-price' => $price_old,
            'body_type' => $item['body_name'],
            'doors-count' => $item['doors'],
            'modification' => $modification,
            'complectation' => $complectation,
            'owners' => $item['Владельцев'],
            'run' => $item['Пробег'],
            'year' => $item['Год выпуска'],
            'vin' => $item['VIN'],
            'generation' => $item['generation_name'],
            'engine_volume' => $item['Характеристики']['Объем в литрах'],
            'engine_power' => $item['Характеристики']['Мощность л.с.'],
            'engine_type' => $item['Характеристики']['Тип двигателя'],
            'drive' => $item['Характеристики']['Привод'],
            'gear' => $item['Характеристики']['Трансмиссия'],
            'acceleration' => $item['Характеристики']['Разгон до 100 км/ч'],
            'car_photos' => json_encode($this->formatPhotos($item['photos_path']), JSON_UNESCAPED_UNICODE),
        ];
    }

    /**
     * @return array
     */
    protected function getProductIds(): array
    {
        if (empty($this->tv_id)) {
            return [];
        }

        $brands = $this->evo->runSnippet("DocLister", [
            'api' => 1,
            'parents' => $this->catalog_id,
            'showParent' => -1,
            'addWhereList' => "c.template = 17",
        ]);
        $brands = json_decode($brands, true);

        $_SESSION[__CLASS__.".brands"] = array_reduce($brands, function ($result, $item) {
            $result[mb_strtolower($item['pagetitle'])] = (int) $item['id'];
            return $result;
        }, []);

        $models = $this->evo->runSnippet("DocLister", [
            'api' => 1,
            'parents' => $this->catalog_id,
            'depth' => 5,
            'showParent' => -1,
            'addWhereList' => "c.template = 20",
        ]);
        $models = json_decode($models, true);

        $brands_flipped = array_flip($_SESSION[__CLASS__.".brands"]);
        $_SESSION[__CLASS__.".models"] = array_reduce($models, function ($result, $item) use ($brands_flipped) {
            $brand = $brands_flipped[(int) $item['parent']];
            $result["{$brand}"."-".mb_strtolower($item['pagetitle'])] = (int) $item['id'];
            return $result;
        }, []);

        $products = $this->evo->runSnippet("DocLister", [
            'api' => 1,
            'parents' => $this->catalog_id,
            'depth' => 5,
            'tvList' => "car_id_old",
            'addWhereList' => "c.template = 28",
        ]);
        $products = json_decode($products, true);

        return array_column($products, "id", "tv_car_id_old");
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

    /**
     * @param  string  $path
     * @return array
     */
    private function formatPhotos(string $path): array
    {
        if (empty($path)) {
            return [];
        }

        $photos = [
            'fieldValue' => [],
            'autoincrement' => 1
        ];

        $image_dir = "assets/import/images/Catalog/{$path}";
        $image_path = $this->evo->config['base_path'].$image_dir;

        if (!is_dir($image_path)) {
            return [];
        }

        $source_photos_arr = scandir($image_path);

        if (empty($source_photos_arr)) {
            return [];
        }

        foreach ($source_photos_arr as $key => $value) {
            if ($value == '.' || $value == '..') {
                unset($source_photos_arr[$key]);
                continue;
            }

            if (!file_exists("{$image_path}/{$value}")) {
                continue;
            }

            $photos['fieldValue'][] = [
                'image' => "{$image_dir}{$value}",
            ];
        }

        return $photos;
    }

    /**
     * @return string
     */
    protected function getItemKeyId(): string
    {
        return "car_id";
    }
}