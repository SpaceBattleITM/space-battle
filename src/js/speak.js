var socket = io();

$(function() {
    socket.on('connectToRoom',function(data) {
        console.log(data);
    });

    socket.on('ready', function (user) {
        $('#game-link').text(location.host + '?room=' + user)
    }.bind(this));

    socket.on('goToPlacementShips', function (user) {
        alert(user);
        $('#toPlacementShips').trigger('click');
    }.bind(this));
});