var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var api = require('./neo4j');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/Index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(msg){
    if (msg == "Age_by_name" ) {
      var response = api.Age_by_name("Alice");
      io.emit('response', response);
    }
    else if (msg == "test") {
      var response = api.test("Alice");
      console.log(response);
      io.emit('response', response);
    }
    else if (msg == "All_nodes" ) {
      api.All_nodes();
    }
    else if (msg == "nodes_of_type" ) {
      api.nodes_of_type("hero");
    }
    else{
      console.log("this query doesn't exist");
      io.emit('response', "this query doesn't exist");
    }

  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});
