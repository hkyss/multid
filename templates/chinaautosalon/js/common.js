$(function() {
	$('.index-brands-block .bottom-link a').click(function() {
		$(this).parent().hide();
		$('.index-brands-block .row .col-3').show();
	});

 
    $(function() {
        $('.slider-for').css('display', 'block');
        $('.slider-nav').css('display', 'block');

        $('.slider-for').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            asNavFor: '.slider-nav'
        });

        
        $('.slider-nav').slick({
            slidesToShow: 6,
            slidesToScroll: 1,
            asNavFor: '.slider-for',
            arrows: true,
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
                }
            ]
        });

    });

	// $(".bottom-page-line .close").click(function(event) {
    // event.stopPropagation(); // Остановить распространение события
    // $(".bottom-page-line").hide();
    // $(".float-button").css("bottom", "20px");
});

// $(".bottom-page-line").click(function() {
//     $.fancybox.open({
//         src: '#trade-in-popup',
//         type: 'inline'
//     });
// });


	window.showCreditPopup = function(e, t, i) {
		$("#credit-popup-plate .popup__image").attr("src", ""),
			$.fancybox.open({
				src: "#credit-popup-plate",
				type: "inline",
				opts: {
					beforeShow: function(n, s) {
						$("#credit-popup-plate .popup__car_id").val(e),
							$("#credit-popup-plate .popup__image").attr("src", t),
							$("#credit-popup-plate .popup__price").text(i + " руб/мес")
					}
				}
			})
	};
	// $('.slider-nav').slick({
	// 	slidesToShow: 6,
	// 	slidesToScroll: 1,
	// 	asNavFor: '.slider-for',
	// 	arrows: false,
	// 	focusOnSelect: true,
	// 	responsive: [{
	// 			breakpoint: 1200,
	// 			settings: {
	// 				slidesToShow: 5
	// 			}
	// 		},
	// 		{
	// 			breakpoint: 768,
	// 			settings: {
	// 				slidesToShow: 4
	// 			}
	// 		}
	// 	]
	// });

	// Подключение плагина Choices для декорирования <select>
    // Аргументом передается селектор (класс/id) тега <select>
	/*const decoreSelect = (selector) => {
        const choicesMarks = new Choices(selector, {
            searchEnabled: false,
        });
    }

    const marks = document.querySelector('#marks');
    if (marks) decoreSelect(marks);
	*/
// });
// Функция для обновления отображения времени// Функция для обновления отображения времени
function updateCountdown(days, hours, minutes, seconds) {
    var ids = ['day', 'hour', 'min', 'sec'];
    var values = [days, hours, minutes, seconds];
    for (var i = 0; i < ids.length; i++) {
        var element = document.getElementById(ids[i]);
        if (element && element.value != values[i]) {
            animateFlip(ids[i]);
            element.value = values[i];
        }
    }
}

// Функция для запуска обратного отсчета
function startCountdown() {
    var dateendElement = document.getElementById('dateend');
    if (!dateendElement) return; // Если элемент dateend отсутствует, выходим из функции

    function updateTimer() {
        var targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 7);
        targetDate.setHours(targetDate.getHours() + 23);
        targetDate.setMinutes(targetDate.getMinutes() + 59);

        var day = String(targetDate.getDate()).padStart(2, '0');
        var month = String(targetDate.getMonth() + 1).padStart(2, '0');
        var year = targetDate.getFullYear();
        var formattedDate = day + '.' + month + '.' + year;

        dateendElement.textContent = formattedDate;

        var intervalId = setInterval(function() {
            var currentDate = new Date();
            var timeDifference = targetDate - currentDate;

            var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            var hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            updateCountdown(days, hours, minutes, seconds);

            if (timeDifference <= 0) {
                clearInterval(intervalId);
                startCountdown(); // Запуск нового таймера после истечения предыдущего
            }
        }, 1000);
    }

    updateTimer();
}

function animateFlip(id) {
    var element = document.getElementById(id);
    if (element) {
        element.classList.add('flip');
        setTimeout(function() {
            element.classList.remove('flip');
        }, 500);
    }
}

// Запуск обратного отсчета при загрузке страницы
window.onload = startCountdown;
