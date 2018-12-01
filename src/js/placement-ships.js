function placementShipsScreen() {
    var generate,
        $body = $('body'),
        orientation = 0,
        rivalReady = 0;

    var myShipsPosition = [
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
    ];

    //Генерация таблиц 10х10
    const generateFields = function() {
        var $container = $('.generate-field', $body);

        var html = '';

        for (var i = 0; i < 100; i++) {
            var x = i % 10,
                y = Math.floor(i/10);

            html += '<div data-x="' + x + '" data-y="' + y + '"><div class="event-cell"></div><div class="addition-cell"></div></div>';
        }

        $container.append(html);
    };

    //Блокировка соседних от корабля полей
    const checkFields = function(clickedCell) {
        ifInRow(clickedCell, 1, 0);
        ifInRow(clickedCell, -1, 0);
        ifInRow(clickedCell, 1, 1);
        ifInRow(clickedCell, -1, 1);
        ifInRow(clickedCell, 0, 1);
        ifInRow(clickedCell, 1, -1);
        ifInRow(clickedCell, -1, -1);
        ifInRow(clickedCell, 0, -1);

        for (var i = 0; i < myShipsPosition.length; i++) {
            if (myShipsPosition[i] === 2) {
                $('.my-field > div', $body).eq(i).addClass('prohibited');
            }
        }
    };

    //Проверка входит ли заблокированная ячейка в заданную ей строку
    const ifInRow = function(i, num, changeLine) {
        changeLine = changeLine * 10;

        const y = Math.floor((i + changeLine) /10);

        if (Math.floor((i - num + changeLine) / 10) === y) {
            if (myShipsPosition[i - num + changeLine] !== 1) {
                myShipsPosition[i - num + changeLine] = 2;
            }
        }
    };

    const waitingToStart = function() {
        $('.ships').addClass('ships-are-placed');

        checkRival();
    };

    const checkRival = function() {
        if (rivalReady === 0) {
            $('.rival-not-ready').slideDown();
        } else {
            $('.rival-not-ready').slideUp();
            $('.rival-ready').slideDown();
            startTimer(10 * 60, $('.timer-start-battle'), timerCallback);
        }
    };

    const timerCallback = function() {
        battleStart();
    };

    const init = function() {
        generate = new generateFields();

        $body.on('click', '.enemy-field.active .event-cell', function() {
            $(this).addClass('explosion');
        });

        //Выбор корабля для установки на поле
        $body.on('click', '.ships-container .ship', function() {
            orientation = 0;
            $('.my-field', $body).addClass('vertical').removeClass('horizontal');

            if (!$(this).hasClass('disabled')) {
                $('.ships-container .ship', $body).removeClass('selected');
                $(this).addClass('selected');

                $body.addClass('set-ships');
            }
        });


        //Проверка доступности полей для записи
        $body.on('mouseover', '.my-field > div', function() {
            if ($body.hasClass('set-ships')) {
                const size = $('.ships .selected', $body).data('size');
                $(this).addClass('size-' + size);


                for (var x = 0; x < size; x++) {
                    if (orientation === 0) {
                        if ($(this).index() + (x * 10) > 99) {
                            $('.my-field', $body).addClass('gradient-bottom');
                        }
                    } else {
                        var row = $(this).index() % 10;
                        if (row + size > 10) {

                            if (Math.floor($(this).index()/10) < Math.floor(($(this).index() + x)/10)) {
                                $('.my-field > div', $body).eq($(this).index() + x).addClass('no-color');
                            }

                            $('.my-field', $body).addClass('gradient-right');
                        }
                    }
                }
            }
        });

        //Удаление лишнего после проверки полей
        $body.on('mouseout', '.my-field > div', function() {
            $(this).removeClass('size-1 size-2 size-3 size-4');
            $('.my-field', $body).removeClass('gradient-bottom gradient-right');
            $('.my-field > div', $body).removeClass('no-color');
        });

        //Установка корабля в ячейку
        $body.on('click', '.my-field > div', function() {
            if ($body.hasClass('set-ships') && !$(this).hasClass('ship') && !$(this).hasClass('prohibited') ) {
                const clickedCell = $(this).index(),
                    src = $('.ships .selected img', $body).attr('src'),
                    size = parseFloat($('.ships .selected', $body).data('size'));

                var flag = 0;

                for (var x = 0; x < size; x++) {
                    if (orientation === 0) {
                        if ( (clickedCell + (x * 10)) > 99 || $('.my-field > div', $body).eq(clickedCell + (x * 10)).hasClass('prohibited')) {
                            flag = 1;
                        }
                    } else {
                        if (clickedCell % 10 + size > 10 || $('.my-field > div', $body).eq(clickedCell + x).hasClass('prohibited')) {
                            flag = 1;
                        }
                    }
                }

                if (flag === 0) {
                    $('.ships .selected', $body).addClass('disabled').removeClass('selected');

                    $body.removeClass('set-ships');

                    for (var i = 0; i < size; i++) {
                        if (orientation === 0) {
                            myShipsPosition[clickedCell + (i * 10)] = 1;
                            $('.my-field > div', $body).eq(clickedCell + (i * 10)).addClass('ship');
                        } else {
                            myShipsPosition[clickedCell + i] = 1;
                            $('.my-field > div', $body).eq(clickedCell + i).addClass('ship');
                        }
                    }

                    $('.my-field > div', $body).eq(clickedCell).addClass('ship').append('<img class="ship-image orientation-'+ orientation +' size-'+ size + '" src="' + src + '">');

                    for (var e = 0; e < myShipsPosition.length; e++) {
                        if (myShipsPosition[e] === 1) {
                            checkFields(e);
                        }
                    }
                }
            }

            //Когда все корабли расставлены
            if ($('.ships .ship').length === $('.ships .ship.disabled').length) {
                waitingToStart();
            }
        });

        //Поворот корабля по нажатии на пробел
        $body.on('keyup', function(e) {
            if ($body.hasClass('set-ships')) {
                if (e.which === 32) {
                    e.preventDefault();

                    if (orientation === 0) {
                        orientation = 1;
                        $('.my-field', $body).addClass('horizontal').removeClass('vertical');
                    } else {
                        orientation = 0;
                        $('.my-field', $body).removeClass('horizontal').addClass('vertical');
                    }

                    // Переопределение зарпещенных полей для активной ячейки
                    var hoveredElements =  $('.my-field').find('.size-4, .size-3, .size-2, .size-1');

                    hoveredElements.trigger('mouseout');
                    hoveredElements.trigger('mouseover');
                }
            }
        });

        //todo Удалить временный обработчик
        $($body.on('click', '#ships-ready', waitingToStart));
        $($body.on('click', '#player-ready', function() {
            rivalReady = 1;
            checkRival();
        }));
    };

    return init();
}