function initFiltersListeners() {
  const filtersButton = document.querySelector('[data-filters-button]');

  // Проверяем, существует ли элемент перед добавлением обработчика события
  if (filtersButton) {
    filtersButton.addEventListener('click', function (event) {
      const url = '/filters/';
      const button = event.target;
      const form = button.closest('form');
      const formData = $(form).serializeArray();
      let newUrl = '';

      formData.forEach(function (item) {
        if (item.value.length > 0) {
          item.value = item.value.replace(/ /g, '+');

          if (item.value.includes(':')) {
            item.value = 'range-' + item.name.replace(/[^+\d]/g, '') + '-' + item.value.replace(':', '-');
          }

          newUrl = `${newUrl}${encodeURI(item.value)}/`;
        }
      });

      if (newUrl.length > 0) {
        newUrl = `${url}${newUrl}`;
        $(form).attr('action', newUrl);
      }

      form.submit();
    });
  } else {
    console.warn('Element with [data-filters-button] not found.');
  }
}

// Запускаем функцию только после полной загрузки DOM
document.addEventListener('DOMContentLoaded', initFiltersListeners);
