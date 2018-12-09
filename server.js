var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var publicPath = path.resolve(__dirname, 'build');
var getUserRoom = 0;
var roomno = 1;

var rooms = [];

//todo Запись комнаты в сессию

app.use(express.static(publicPath));
app.get('/', function(req, res) {
    res.sendFile('index.html', {root: publicPath});
});

io.on('connection', function (socket) {
    //console.log(socket);
    var getRoom = socket.handshake.headers['referer'].split('room=')[1];
    if (getRoom) {
        getUserRoom = getRoom;
    }

    if (getUserRoom !== 0) {
        roomno = getUserRoom;
    } else {
        roomno = Date.now();
    }

    //Increase roomno 2 clients are present in a room.
    if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
    socket.join("room-"+roomno);

    //Send this event to everyone in the room.
    io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. " + roomno);

    io.in("room-"+roomno).clients((err, clients) => {
        //console.log(clients, clients.length);

         if (clients.length === 2) {
             io.sockets.in("room-"+roomno).emit('goToPlacementShips');
         }
    });

    socket.emit('ready', roomno);

    //Получение данных
    socket.on('shipsReady', function(e) {
        var socketRoom = RoomSocket(socket)[1];
        io.sockets.in(socketRoom).emit('playerReady');
    });

    socket.on('shot', function(index) {
        var socketRoom = RoomSocket(socket)[1];
        io.sockets.in(socketRoom).emit('shot', index);
    });

    socket.on('enemyShot', function(index, bool) {
        var socketRoom = RoomSocket(socket)[1];
        io.sockets.in(socketRoom).emit('enemyShot', index, bool);
    });

    socket.on('endGame', function() {
        var socketRoom = RoomSocket(socket)[1];
        io.sockets.in(socketRoom).emit('endGame');
    });
});

function RoomSocket(socket) {
    var socketRoom = '';
    var socketID = '';
    Object.keys(socket.rooms).map(function(objectKey, index) {
        var value = socket.rooms[objectKey];

        if (index === 0) {
            socketID = value;
        } else if (index === 1) {
            socketRoom = value;
        }
    });

    return [socketID, socketRoom];
}

http.listen(port, () => {
    console.log('Server listening at port %d', port);
});
