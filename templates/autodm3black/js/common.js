$(function() {
	// получаем ссылку по селектору
const link = document.getElementById("float-button");

// добавляем слушатель события 'click'
link.addEventListener('click', (event) => {
  // предотвращаем переход по ссылке по умолчанию
  event.preventDefault();
  // вызываем функцию, которая показывает модальное окно
  $('#callphone').modal('show');
});

	$('.footer nav p').click(function() {
		$(this).next('ul').toggleClass('opened');
	});
	$('.menubg').click(function() {
		$('.menubg').fadeOut();
		$('.header ul').removeClass('opened');
	});
	$('.header .menu-button').click(function() {
		$('.menubg').fadeIn();
		// $('.header ul').addClass('opened');
		$('.header ul').toggleClass('opened');
	});

	let liFirst = document.createElement('li');
	liFirst.classList.add('left-child1');
	liFirst.innerHTML = '<button class="left-listClose" id="left-listClose">X</button>';
	$('.header ul').prepend(liFirst);

	let liLast = document.createElement('li');
	liLast.classList.add('left-childlast');
	liLast.innerHTML = '<button type="button" class="left-listCall" data-toggle="modal" data-target="#oneclick">Заказать звонок</button>';
	$('.header ul').append(liLast);
	$('.header ul').remove(liFirst);
	$('.header ul').remove(liLast);

	const close = document.querySelector('.left-listClose');
	close.onclick = function () {
		$('.header ul').toggleClass('opened');
		$('.header ul').removeClass('left-child1');
		$('.header ul').remove(liLast);
	}

	$('.slider-for').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		asNavFor: '.slider-nav',
		responsive: [{
			breakpoint: 576,
			settings: {
				arrows: false,
				dots: true
			}
		}]
	});
	$('.slider-nav').slick({
		slidesToShow: 4,
		slidesToScroll: 3,
		asNavFor: '.slider-for',
		arrows: true,
		focusOnSelect: true
	});
	/*if ($(window).width() < 576) {
		$('.catalog-block .list').slick({
			dots: true
		});
	}*/
	if ($(window).width() < 576) {
		$('.compilations-block .row').slick({
			arrows: false,
			dots: true
		});
	}
	if ($(window).width() < 576) {
		$('.services-block .row').slick({
			arrows: false,
			dots: true,
			adaptiveHeight: true
		});
	}
	$('.articles-block .list').slick({
		dots: true,
		arrows: false,
		speed: 300,
		slidesToShow: 3,
		slidesToScroll: 1,
		responsive: [{
				breakpoint: 1510,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});
});

// $(document).ready(function() {
//   var amountInput = $('#amount');
//   var amount2Input = $('#amount2');
//   var paymentSpan = $('#payment');
//   var priceDiv = $('.price');
//   var price = parseFloat(priceDiv.text().replace(/\s+/g, '').replace(/₽/, ''));
//
//   // Add a slider for the car price using the .price element as the maximum value
//   $( "#slider-range-max" ).slider({
//     range: "max",
//     min: price/40,
//     max: price,
//     value: 500000,
//     slide: function( event, ui ) {
//       $( "#amount" ).val( ui.value.toLocaleString('ru-RU') + " р.");
//       updatePayment();
//     }
//   });
//   $( "#amount" ).val( $( "#slider-range-max" ).slider( "value" ).toLocaleString('ru-RU') + " р." );
//
// $( "#slider-range-max2" ).slider({
//     range: "max",
//     min: 12,
//     max: 88,
//     value: 88, // задаем значение по умолчанию
//     slide: function( event, ui ) {
//       $( "#amount2" ).val( ui.value + " месяцев");
//       updatePayment();
//     }
// });
//
// // устанавливаем значение по умолчанию в поле "Срок кредита"
// $( "#amount2" ).val( $( "#slider-range-max2" ).slider( "value" ) + " месяцев" );
//
//
// function updatePayment() {
//   var amountInput = $("#amount");
//   if (amountInput.length > 0 && typeof amountInput.val() !== "undefined") {
//     var amount = parseFloat(amountInput.val().replace(/\D/g, '')) || 0;
//     var amount2Input = $("#amount2");
//     var paymentSpan = $("#payment");
//     var amount2 = parseFloat(amount2Input.val()) || 0;
//     var payment = (amount) / amount2 * 1.24;
//     paymentSpan.text(payment.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' р/мес.');
//   }
// }
//
//
//   // Call the updatePayment function when the page loads and whenever the inputs change
//   updatePayment();
//   amountInput.on('input', updatePayment);
//   amount2Input.on('change', updatePayment);
// });

$(document).ready(function() {
  var amountInput = $('#amount');
  var amount2Input = $('#amount2');
  var paymentSpan = $('#payment');
  var priceDiv = $('.price-block .price');
  var price = parseFloat(priceDiv.text().replace(/\s+/g, '').replace(/₽/, ''));

  $( "#slider-range-max" ).slider({
    range: "max",
    min: 10000,
    max: price,
    value: price / 2,
    slide: function(event, ui) {
      $( "#amount" ).val(ui.value.toLocaleString('ru-RU') + " р.");
      updatePayment();
    }
  });
  $( "#amount" ).val($( "#slider-range-max" ).slider("value").toLocaleString('ru-RU') + " р.");

  $( "#slider-range-max2" ).slider({
    range: "max",
    min: 12,
    max: 96,
    value: 84,
    slide: function(event, ui) {
      $( "#amount2" ).val(ui.value + " месяцев");
      updatePayment();
    }
  });

  $( "#amount2" ).val($( "#slider-range-max2" ).slider("value") + " месяцев");

  function updatePayment() {
    var amount = parseFloat(amountInput.val().replace(/\D/g, '')) || 0;
    var amount2 = parseFloat(amount2Input.val().replace(/\D/g, '')) || 0;
    // if (amount > 0 && amount2 > 0) {
    //   var payment = (amount * 1.24) / amount2;
    //   paymentSpan.text(payment.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' р/мес.');
    // }

    const interest = 5.6;

    amount = Number(amount);
    let years = Number(amount2) / 12;

    // Рассчитываем ежемесячную процентную ставку и количество платежей
    const monthlyInterest = interest / 100 / 12
    const payments = years * 12

    // Рассчитываем ежемесячный платеж
    const x = Math.pow(1 + monthlyInterest, payments)
    let monthlyPayment = (amount * x * monthlyInterest) / (x - 1)

    // Округляем ежемесячный платеж до двух знаков после запятой
    monthlyPayment = parseFloat(monthlyPayment.toFixed(2));

    // Рассчитываем общую сумму платежа
    let totalPayment = parseFloat((monthlyPayment * payments).toFixed(2))

    // Рассчитаем сумму переплат
    let totalInterest = parseFloat((totalPayment - amount).toFixed(2))

    monthlyPayment = Math.round(monthlyPayment);
    totalPayment = Math.round(totalPayment);
    totalInterest = Math.round(totalInterest);

    // carCreditSum.innerHTML = totalPayment.toLocaleString("ru") + ' ₽';
    // carCreditPayment.innerHTML = 'от ' + monthlyPayment.toLocaleString("ru") + ' ₽/мес.';

    paymentSpan.text(monthlyPayment.toLocaleString("ru") + ' ₽/мес.');
  }

  updatePayment();
  amountInput.on('input', updatePayment);
  amount2Input.on('change', updatePayment);
});


//SHORTENED CODE

