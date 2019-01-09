function battleStart() {
    var show,
        $body = $('body');

    const showEnemyField = function() {
        $body.removeClass('placementShips set-ships').addClass('battle');

        if (turn !== 1) {
            $('.header-bar').addClass('enemy');
            $('.enemy-field').removeClass('active');
        }

        startTimer(15 * 60, $('#turn-timer'), function() {
            changeTurn(-1)
        });
    };

    const shot = function($cell) {
        const $eventCell = $cell.find('.event-cell');
        if (!$eventCell.hasClass('explosion')) {
            $eventCell.addClass('explosion');

            const index = $cell.index();
            socket.emit('shot', index);
        }
    };

    socket.on('enemyShot', function (index, bool) {
        if (turn === 0) {
            console.log(index, bool);

            const $eventCell = $('.enemy-field > div').eq(index).find('.event-cell');
            if (bool === true) {
                $eventCell.addClass('hit');
            } else {
                $eventCell.addClass('missed');
            }
        }

    }.bind(this));

    function find(array, value) {

        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) return i;
        }

        return -1;
    }

    const socketTurn = function(index) {
        if (turn === 1) {
            console.log('Это был твой ход', index)
        } else {
            console.log('Это был ход противника', index);
            shotMyField(index);
        }

        changeTurn();
    };

    socket.on('shot', function (index) {
        socketTurn(index);
    }.bind(this));

    const changeTurn = function() {
        globalFunctionStop = 1;
        setTimeout(function() {
            startTimer(15 * 60, $('#turn-timer'), changeTurn);

            if (turn === 1) {
                turn = 0;
                setTimeout(function() {
                    $('.header-bar').addClass('enemy');
                    $('.enemy-field').removeClass('active');
                }, 200);
            } else {
                turn = 1;
                setTimeout(function() {
                    $('.header-bar').removeClass('enemy');
                    $('.enemy-field').addClass('active');
                }, 200);
            }
        }, 30);
    };

    const shotMyField = function(shot) {
        var $cell = $('.my-field > div').eq(shot);

        $cell.find('.event-cell').addClass('explosion');

        var index = $cell.index(),
            arrayCell = myShipsPosition[index];

        setTimeout(function() {
            if (arrayCell === 1) {
                $cell.find('.event-cell').addClass('hit');
                socket.emit('enemyShot', shot, true);
                myShipsPosition[index] = 5;

                console.log('Ships: ' + find(myShipsPosition, 1));
                if (find(myShipsPosition, 1) === -1) {
                    endBattle(0);
                    finalFlag = 1;
                    socket.emit('endGame');
                }
            } else {
                $cell.find('.event-cell').addClass('missed');
                socket.emit('enemyShot', shot, false);
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