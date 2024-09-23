<?php
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

define('MODX_API_MODE', true);
include_once(__DIR__."/../../../index.php");
$modx->db->connect();

$token = !empty($_REQUEST['token']) ? $modx->db->escape($_REQUEST['token']) : "";
$last_request_date = !empty($_REQUEST['last_request_date']) ? $modx->db->escape($_REQUEST['last_request_date']) : "";

$whereDate = "";
if (!empty($last_request_date)) {
    $last_request_date = date('Y-m-d H:i:s', strtotime($last_request_date.' - 3 hours'));
    $whereDate = "and `created_at` > \"{$last_request_date}\"";
}

if (empty($token)) {
    die(json_encode([], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

$table_content = $modx->getFullTableName('site_content');
$table_values = $modx->getFullTableName('site_tmplvar_contentvalues');
$table_results = $modx->getFullTableName('form_results');

$results = $modx->db->makeArray(
    $modx->db->query("SELECT * FROM {$table_results} WHERE `fields` LIKE \"%{$token}%\" {$whereDate} ORDER BY `id` ASC")
);

$cars = $modx->db->makeArray(
    $modx->db->query("SELECT `id` FROM {$table_content} WHERE `template` in (8,28) ORDER BY `id` ASC")
);

$company_id = $modx->db->getValue(
    $modx->db->query("SELECT `contentid` FROM {$table_values} WHERE `tmplvarid` = 59 and `value` = \"{$token}\"")
);

if (empty($company_id)) {
    die(json_encode([], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

$data = [];
$company = $modx->getDocumentObject("id", $company_id);

if (empty($results)) {
    die(json_encode([], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

foreach ($results as $item) {
    $fields = json_decode($item['fields'], true);

    switch ($item['form_id']) {
        case "callback":
            $request_type = "Заявки на обратный звонок";
            break;
        case "credit":
            $request_type = "Заявки Кредит";
            break;
        case "creditCar":
            $request_type = "Заявки на авто в кредит";
            break;
        case "leads":
            $request_type = "Новый лид";
            break;
        default:
            $request_type = "Новая заявка";
            break;
    }

    $brand = (string) $fields['brand'];
    $model = (string) $fields['model'];

    $resourceId = (int) $fields['resourceId'];
    $car_cost = 0;
    $model_year = "";
    $mileage = 0;
    $credit_term = (string) $fields['limitation'];
    $credit_term = (string) explode(" ", $credit_term)[0];

    if (!empty($resourceId)) {
        $resource = $modx->getDocumentObject("id", $resourceId);

        if ((int) $resource['template'] === 8) {
            $brand = $resource['mark'][1];
            $model = $resource['model'][1];
            $car_cost = (int) $resource['car-price'][1];
            $model_year = $resource['year'][1];
            $mileage = (int) $resource['run'][1];
        }
    }

    $name = trim((string) $fields['name']);
    $phone = trim((string) $fields['phone']);

    if (empty($name)) {
        $name = trim((string) $fields['first_name']);
    }

    if (empty($phone)) {
        $phone = trim((string) $fields['mobile_tel']);
    }

    $data[] = [
        'mobile_tel' => preg_replace('/[^0-9]/', '', $phone),
        'last_name' => "",
        'first_name' => $name,
        'middle_name' => "",
        'brand' => $brand,
        'model' => $model,
        'email' => (string) $fields['email'],
        'inital_pay' => (int) $fields['price'],
        'created' => date('Y-m-d H:i:s', strtotime((string) $item['created_at'].' + 3 hours')),
        'car_cost' => $car_cost,
        'ad_channel' => "",
        'org_tel' => preg_replace('/[^0-9]/', '', (string) $company['salon-phone'][1]),
        'age' => "",
        'work_term' => "",
        'work_income' => "",
        'work_org' => (string) $company['salon-name'][1],
        'model_year' => $model_year,
        'mileage' => $mileage,
        'request_type' => $request_type,
        'month_pay' => "",
        'credit_term' => $credit_term,
        'ip_address' => (string) $fields['ip'],
        'referer' => (string) $fields['referer'],
        'desired_amount' => "",
        'utm_source' => (string) $fields['utm_source'],
        'utm_medium' => (string) $fields['utm_medium'],
        'utm_content' => (string) $fields['utm_content'],
        'utm_campaign' => (string) $fields['utm_campaign'],
    ];
}

die(
json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
);
