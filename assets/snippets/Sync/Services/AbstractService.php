<?php

namespace EvolutionCMS\Snippets\Sync\Services;

abstract class AbstractService
{
    /**
     * @var \DocumentParser
     */
    protected \DocumentParser $evo;

    /**
     * @var \modResource
     */
    protected \modResource $model;

    /**
     * @var int
     */
    protected int $tv_id = 0;

    /**
     * @var string
     */
    protected string $catalog_file = "";

    public function __construct()
    {
        $this->evo = EvolutionCMS();
        $this->model = new \modResource($this->evo);
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

        foreach ($catalog as $key => $item) {
            $id_old = (int) $item['id'];
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
     * @param  array  $params
     * @param  bool  $events
     * @param  bool  $cache
     * @return int
     */
    protected function create(array $params, bool $events = true, bool $cache = false): int
    {
        $id = $this->model->create($params)
            ->save($events, $cache);
        $this->model->close();
        return $id;
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
        $this->model->edit($id);

        foreach ($params as $key => $value) {
            $this->model->set($key, $value);
        }

        $this->model->save($events, $cache);
        $this->model->close();
    }

    /**
     * @return array
     */
    protected function getCatalogData(): array
    {
        $catalog_file_path = $this->evo->config['base_path']."assets/import/{$this->catalog_file}";

        if (!file_exists($catalog_file_path)) {
            return [];
        }

        $catalog = file_get_contents($catalog_file_path);
        return json_decode($catalog, true);
    }

    /**
     * @param  array  $item
     * @return array
     */
    protected function params(array $item): array
    {
        return $item;
    }

    /**
     * @return array
     */
    protected function getProductIds(): array
    {
        if (empty($this->tv_id)) {
            return [];
        }

        $table_values = $this->evo->getFullTableName("site_tmplvar_contentvalues");
        $values = $this->evo->db->makeArray(
            $this->evo->db->query("SELECT * FROM {$table_values} WHERE tmplvarid = {$this->tv_id}")
        );

        return array_reduce($values, function ($result, $item) {
            $result[(int) $item['value']] = (int) $item['contentid'];
            return $result;
        }, []);
    }
}
