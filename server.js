var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var publicPath = path.resolve(__dirname, 'build');
var getUserRoom = 0;
var roomno = 1;

app.use(express.static(publicPath));
app.get('/', function(req, res){
    res.sendFile('index.html', {root: publicPath});
});

io.on('connection', function (socket) {
    console.log(socket);
    var getRoom = socket.handshake.headers['referer'].split('room=')[1];
    if (getRoom) {
        getUserRoom = getRoom;
    }

    if (getUserRoom !== 0) {
        roomno = getUserRoom;
    } else {
        roomno = Date.now();
    }

    //Если на 3000 порт подключается ещё игрок, то у первого меняется его комната

    //Increase roomno 2 clients are present in a room.
    if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
    socket.join("room-"+roomno);

    //Send this event to everyone in the room.
    io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. " + roomno);

    console.log(roomno);

    io.in("room-"+roomno).clients((err, clients) => {
        console.log(clients, clients.length); // an array containing socket ids

        if (clients.length === 2) {
            io.emit('goToPlacementShips', roomno);
        }
    });
    
    io.emit('ready', roomno);
});

http.listen(port, () => {
    console.log('Server listening at port %d', port);
});
