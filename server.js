var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var qr = require('qr-image');

var publicPath = path.resolve(__dirname, 'build');
var roomno = 1;

//todo Запись комнаты в сессию*

app.use(express.static(publicPath));
app.get('/', function(req, res) {
    res.sendFile('index.html', {root: publicPath});
});

io.on('connection', function (socket) {
    var getUserRoom = 0;
    var getRoom = socket.handshake.headers['referer'].split('room=')[1];
    if (getRoom) {
        getUserRoom = getRoom;
    }

    if (getUserRoom !== 0) {
        roomno = getUserRoom;
    } else {
        roomno = Date.now();
    }

    // QR generate
    var svg_string = qr.imageSync(socket.handshake.headers['referer'] + '?room=' + roomno, { type: 'svg' });
    socket.emit('qr', svg_string);

    if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
    socket.join("room-"+roomno);

    io.sockets.in("room-"+roomno).emit('connectToRoom', roomno);

    io.in("room-"+roomno).clients((err, clients) => {
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

    socket.on('restart', function(e) {
        var socketRoom = RoomSocket(socket)[1];
        io.sockets.in(socketRoom).emit('restart');
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
