$(function() {
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}

	var Filter = {
		el: document.querySelector('.extrafilter'),
		range_separator: ':',
		values_separator: '&',
		init: function() {
			if (!this.el) {
				console.warn('Element .extrafilter not found. Initialization aborted.');
				return;
			}

			let sliders = $('.filter-range-slider');
			if (sliders.length) {
				sliders.ionRangeSlider({
					grid: true,
					grid_num: 10,
					from_shadow: true,
					to_shadow: true,
					input_values_separator: Filter.range_separator,
					onFinish: function(data) { Filter.build(false); },
					onStart: Filter.updateInputs,
					onChange: Filter.updateInputs
				});
			}

			$(document).on('click', '.extrafilter .filterbutton', function(e) {
				e.preventDefault();
				Filter.build();
				window.location.href = $(this).attr('href');
			});

			$(document).on('change', '.choicesCar', function(e) {
				e.preventDefault();
				if ($(this).attr('id') == 'formModel42') {
					Filter.build();
				}
			});

			$(document).on('click', '.Button--reset', function(e) {
				e.preventDefault();

				$('.choicesCar').prop('selectedIndex', 0);

				$('.filter-range-slider').each(function() {
					var slider = $(this).data('ionRangeSlider');
					if (slider) {
						slider.update({
							from: slider.result.min,
							to: slider.result.max
						});
					}
				});

				Filter.build();
			});
		},
		build: function(reload = true) {
			let data = {};
			let filterList = [];
			$('.extrafilter [name]').each(function(i, el) {
				let id = el.dataset.id;
				if ((el.type === 'checkbox' && el.checked) || (el.type !== 'checkbox')) {
					if (el.dataset && el.dataset.inputType === 'range') {
						if (!data[id]) {
							data[id] = 'f[' + id + ']=';
						}
						if (el.value !== el.dataset.min + Filter.range_separator + el.dataset.max) {
							data[id] += el.value + Filter.values_separator;
							if (el.value) {
								filterList.push('f[' + id + ']=' + el.value);
							}
						} else {
							data[id] += Filter.values_separator;
						}
					} else {
						if (!data[id]) {
							data[id] = 'f[' + id + ']=';
						}
						data[id] += el.value + Filter.values_separator;
						if (el.value) {
							filterList.push('f[' + id + ']=' + el.value);
						}
					}
				}
			});

			data = Object.values(data).filter(function(el) {
				let [name, value] = el.split('=');
				if (value === '' || value.replace(/\|/g, '') === '') {
					return false;
				}
				return el;
			}).map(function(el) {
				return el.slice(0, -1);
			}).join('&');

			let buttonUrl = '/avtomobili-s-probegom2';
			if (filterList.length > 0) {
				buttonUrl += '?' + filterList.join('&');
			}

			let filterButton = $('.extrafilter .filterbutton');
			if (filterButton.length) {
				filterButton.attr('href', buttonUrl);
			}

			if (reload) {
				Filter.load(data);
			}
		},
		updateInputs: function(data) {
			console.log(data);
			let from = numberWithCommas(data.from);
			let to = numberWithCommas(data.to);
			let input = $(data.input);
			let rangeGroup = input.parent().siblings('.price-range-group');

			if (rangeGroup.length) {
				rangeGroup.find('.range-min').val(from);
				rangeGroup.find('.range-max').val(to);
			}
		},
		load: function(data) {
			$.ajax({
				url: location.pathname,
				data: data.replace(/\+/g, '%2B'),
				beforeSend: function() {
					$('#loader').addClass('show');
					$('[name="f[43]"]').attr('disabled', 'disabled');
				},
				success: function(data) {
					data = $(data);
					let dataFilter = $('.extrafilter [name]', data);
					for (let i = 0; i < dataFilter.length; i++) {
						if (!dataFilter[i].id) continue;
						let $el = $('#' + dataFilter[i].id);
						if (dataFilter[i].type === 'checkbox' || dataFilter[i].type === 'select-one') {
							$el.replaceWith(dataFilter[i]);
						}
					}
					$('#loader').removeClass('show');
					$('[name="f[43]"]').removeAttr('disabled');
				}
			});
		},
	};

	// Ensure the DOM is fully loaded before initializing
	document.addEventListener('DOMContentLoaded', function() {
		Filter.init();
	});
});
