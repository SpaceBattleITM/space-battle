var socket = io();
var usersReady = 0;

$(function() {
    var $window = $(window);

    socket.on('connectToRoom',function(data) {
        console.log(data);
    });

    socket.on('ready', function (room) {
        $('#game-link').text(location.host + '?room=' + room);
    }.bind(this));

    //Данные что любой член комнаты расставил корабли
    socket.on('playerReady', function () {
        usersReady++;
        $window.trigger('userReady');
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