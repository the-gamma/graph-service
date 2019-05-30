var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var api = require('./neo4j');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index_test.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});


var p1 = new Promise( (resolve, reject) => {
  resolve('Success!');
  // or
  // reject(new Error("Error!"));
} );
