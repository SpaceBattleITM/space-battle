function battleStart() {
    var show,
        $body = $('body');

    const showEnemyField = function() {
        $body.removeClass('placementShips set-ships').addClass('battle');
        startTimer(15 * 60, $('#turn-timer'), changeTurn);

        if (turn === 1) {
            $('.enemy-field').addClass('active');
        }
    };

    const shot = function($cell) {
        const $eventCell = $cell.find('.event-cell');
        if (!$eventCell.hasClass('explosion')) {
            $eventCell.addClass('explosion');

            const index = $cell.index(),
                arrayCell = enemyShips[index];

            setTimeout(function() {
                if (arrayCell === 1) {
                    $eventCell.addClass('hit');
                    enemyShips[index] = 5;

                    if (find(enemyShips, 1) === -1) {
                        endBattle(1);
                    }
                } else {
                    $eventCell.addClass('missed');
                }
            }, 300);
            changeTurn();
        }
    };

    const changeTurn = function() {
        globalFunctionStop = 1;
        setTimeout(function() {
            startTimer(15 * 60, $('#turn-timer'), changeTurn);

            if (turn === 1) {
                turn = 0;
                $('.header-bar').addClass('enemy');
                $('.enemy-field').removeClass('active');
                artificialOpponent();
            } else {
                turn = 1;
                $('.header-bar').removeClass('enemy');
                $('.enemy-field').addClass('active');
            }
        }, 30);
    };

    //Рандомные выстрелы противника

    var botShots = [
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

    const artificialOpponent = function() {
        setTimeout(function() {
            var shot = generateRandom();

            if (botShots[shot] !== 1) {
                botShots[shot] = 1;
                shotMyField(shot);
                changeTurn();
            } else {
                while (botShots[shot] !== 0) {
                    shot = generateRandom();

                    if (botShots[shot] !== 1) {
                        shotMyField(shot);
                        changeTurn();
                    }
                }
            }

        }, (1000 + generateRandom() * 10));
    };

    const generateRandom = function() {
        return Math.floor(Math.random() * (99 + 1));
    };

    function find(array, value) {

        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) return i;
        }

        return -1;
    }

    //Конец рандома

    const shotMyField = function(shot) {
        var $cell = $('.my-field > div').eq(shot);

        $cell.find('.event-cell').addClass('explosion');

        var index = $cell.index(),
            arrayCell = myShipsPosition[index];

        setTimeout(function() {
            if (arrayCell === 1) {
                $cell.find('.event-cell').addClass('hit');
                arrayCell = 5;

                if (find(myShipsPosition, 1) === -1) {
                    endBattle(0);
                }
            } else {
                $cell.find('.event-cell').addClass('missed');
            }
        }, 500);
    };

    const init = function() {
        show = new showEnemyField();

        $body.on('click', '.enemy-field.active > div', function() {
            shot($(this));
        });
    };

    return init();
}