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

            const index = $cell.index(),
                arrayCell = enemyShips[index];

            // setTimeout(function() {
            //     if (arrayCell === 1) {
            //         $eventCell.addClass('hit');
            //         enemyShips[index] = 5;
            //
            //         if (find(enemyShips, 1) === -1) {
            //             endBattle(1);
            //         }
            //     } else {
            //         $eventCell.addClass('missed');
            //     }
            // }, 300);
            socket.emit('shot', index);
        }
    };

    socket.on('enemyShot', function (index, bool) {
        if (turn === 0) {
            console.log(index, bool);

            const $eventCell = $('.enemy-field > div').eq(index).find('.event-cell');
            if (bool === true) {
                $eventCell.addClass('hit');

                // console.log('Моих кораблей осталось: ' + find(myShipsPosition, 1));
                //
                // if (find(myShipsPosition, 1) === -1) {
                //     endBattle(1);
                // }
            } else {
                $eventCell.addClass('missed');
            }
        }

    }.bind(this));

    //Рандомные выстрелы противника

    // var botShots = [
    //     0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,
    // ];

    const artificialOpponent = function() {
        // setTimeout(function() {
        //     var shot = generateRandom();
        //
        //     if (botShots[shot] !== 1) {
        //         botShots[shot] = 1;
        //         shotMyField(shot);
        //         changeTurn();
        //     } else {
        //         while (botShots[shot] !== 0) {
        //             shot = generateRandom();
        //
        //             if (botShots[shot] !== 1) {
        //                 shotMyField(shot);
        //                 changeTurn();
        //             }
        //         }
        //     }
        //
        // }, (1000 + generateRandom() * 10));
    };

    // const generateRandom = function() {
    //     return Math.floor(Math.random() * (99 + 1));
    // };

    //Конец рандома

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

    const changeTurn = function(index) {
        globalFunctionStop = 1;
        setTimeout(function() {
            startTimer(15 * 60, $('#turn-timer'), changeTurn);

            if (turn === 1) {
                turn = 0;
                $('.header-bar').addClass('enemy');
                $('.enemy-field').removeClass('active');
                //artificialOpponent();
            } else {
                turn = 1;
                $('.header-bar').removeClass('enemy');
                $('.enemy-field').addClass('active');
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