var socket = io();
var myRoom = 0;
var roomLock = 0;

$(function() {
    socket.on('connectToRoom',function(data) {
        console.log(data);
    });

    socket.on('ready', function (room) {
        if (roomLock === 0) {
            roomLock = 1;
            myRoom = room;
            $('#game-link').text(location.host + '?room=' + room);
            console.log(myRoom);
        }

    }.bind(this));

    socket.on('goToPlacementShips', function (room) {
        if (room === myRoom) {
            $('#toPlacementShips').trigger('click');
        }
    }.bind(this));
});