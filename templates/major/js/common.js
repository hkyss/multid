$(function(){
	/*$('.item-page .item .link').click(function() {
		$(this).toggleClass('active');
		$(this).parent().toggleClass('opened');
		$(this).parent().find('.top-block').toggle();
		$(this).parent().find('.hidden-block').toggleClass('opened');
	});*/
	$('.brands-block .bottom-link a').click(function() {
		$('.brands-block .list').show();
	});
	$('.dealers-block .button button').click(function() {
		$('.dealers-block .flex .list').show();
	});
	$('.menubg').click(function() {
		$('.menubg').fadeOut();
		// $('.header ul').removeClass('opened');
		// $('.header ul').removeClass('opened');
	});
	$('.header .menu-button').click(function() {
		$('.menubg').fadeIn();
		// $('.header ul').addClass('opened');
	});
	$('.index-page-slider').slick({
		arrows: false,
		dots: true
	});
	$('.slider-for').slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: false,
	  asNavFor: '.slider-nav'
	});
	$('.slider-nav').slick({
	  slidesToShow: 4,
	  slidesToScroll: 1,
	  asNavFor: '.slider-for',
	  focusOnSelect: true,
	  responsive: [{
		breakpoint: 1200,
		settings: {
			slidesToShow: 5
		}
	},
	{
		breakpoint: 768,
		settings: {
			slidesToShow: 4
		}
	},
	{
		breakpoint: 575,
		settings: {
			slidesToShow: 1,
			dots: true,
			arrows: false
		}
	}
]
	});
});
$(document).ready(function () {
	function updateResults () {
	  const creditAmount = $('#slider-range-max3').slider('value')
	  const downPayment = $('#slider-range-max').slider('value')
	  const term = $('#slider-range-max2').slider('value')
	  const creditRate = 0.1
	  const monthlyPayment = (creditAmount - downPayment) * (creditRate / 12) / (1 - Math.pow(1 + creditRate / 12, -term))

	  $('.tbl1 tr:nth-child(1) td:nth-child(2)').text(creditAmount.toLocaleString() + ' ₽')
	  $('.tbl1 tr:nth-child(2) td:nth-child(2)').text(downPayment.toLocaleString() + ' ₽')
	  $('.tbl1 tr:nth-child(3) td:nth-child(2)').text(term + ' месяцев')
	  $('.tbl2 tr:nth-child(1) td:nth-child(2)').text(Math.round(monthlyPayment).toLocaleString() + ' ₽/мес.')
	}

	function updateDownPaymentSlider (creditAmount) {
	  const minDownPayment = 0.1 * creditAmount
	  const maxDownPayment = 0.9 * creditAmount
	  let currentDownPayment = $('#slider-range-max').slider('value')

	  if (currentDownPayment < minDownPayment) {
		currentDownPayment = minDownPayment
	  } else if (currentDownPayment > maxDownPayment) {
		currentDownPayment = maxDownPayment
	  }

	  $('#slider-range-max').slider('option', 'min', minDownPayment)
	  $('#slider-range-max').slider('option', 'max', maxDownPayment)
	  $('#slider-range-max').slider('value', currentDownPayment)

	  $('#amount').val(currentDownPayment.toLocaleString() + ' ₽')
	}

	$('#slider-range-max3').slider({
	  range: 'max',
	  min: 100000,
	  max: 1000000,
	  value: 500000,
	  slide: function (event, ui) {
		$('#amount3').val(ui.value.toLocaleString() + ' ₽')
		updateDownPaymentSlider(ui.value)
		updateResults()
	  }
	})

	$('#slider-range-max').slider({
	  range: 'max',
	  min: 10000,
	  max: 900000,
	  value: 250000,
	  slide: function (event, ui) {
		$('#amount').val(ui.value + ' ₽')
		updateResults()
	  }
	})

	$('#slider-range-max2').slider({
	  range: 'max',
	  min: 12,
	  max: 60,
	  value: 12,
	  slide: function (event, ui) {
		$('#amount2').val(ui.value + (ui.value > 12 && ui.value < 60 ? ' месяца' : ' месяцев'))
		updateResults()
	  }
	})

	updateResults()
  })

  document.addEventListener('DOMContentLoaded', function() {
    var showAllButton = document.getElementById('show-all-brands');
    showAllButton.addEventListener('click', function() {
        var brands = document.querySelectorAll('.brands-container .brand-item');
        brands.forEach(function(brand) {
            brand.style.display = 'flex';
        });
        showAllButton.style.display = 'none';
    });
});
  