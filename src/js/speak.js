var socket = io();
var usersReady = 0;

$(function() {
    var $window = $(window);

    socket.on('connectToRoom',function(data) {
        console.log(data);
        if (location.search.length === 0) {
            history.pushState(null, null, '?room=' + data);
        }
    });

    socket.on('ready', function (room) {
        $('#game-link').text(location.host + '?room=' + room);
        $('#for-copy').val(location.host + '?room=' + room);

        $('.loading').addClass('hided');
    }.bind(this));

    //Данные что любой член комнаты расставил корабли
    socket.on('playerReady', function () {
        usersReady++;
        $window.trigger('userReady');
    }.bind(this));

    //Получение QR кода
    socket.on('qr', function (svg) {
        $('.qr').html(svg);
    }.bind(this));

    //Сигнал что корабли данного клиента расставлены
    $window.on('shipsReady', function() {
        socket.emit('shipsReady');
    });

    socket.on('endGame', function () {
        if (finalFlag === 0) {
            endBattle(1);
        }
    }.bind(this));
});