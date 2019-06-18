var app = require('express')();
var http = require('http').createServer(app);
//var io = require('socket.io')(http);
var api = require('./neo4j');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/drWho', function(req, res) {
    api.All_nodes().then(resultJson => {
      res.setHeader('Content-Type', 'text/plain');
      res.end(resultJson);
    });
});

app.get('/drWho/nodes_of_type/:type', function(req, res) {
    api.nodes_of_type(req.params.type).then(resultJson => {
      res.setHeader('Content-Type', 'text/plain');
      res.end(resultJson);
    });
});

app.get('/drWho/links_from_node/:node_id', function(req, res) {
    api.links_from_node(req.params.node_id).then(resultJson => {
      res.setHeader('Content-Type', 'text/plain');
      res.end(resultJson);
    });
});

app.get('/drWho/links_from_any_node/:label_type', function(req, res) {
    api.links_from_any_node(req.params.label_type).then(resultJson => {
      res.setHeader('Content-Type', 'text/plain');
      res.end(resultJson);
    });
});

app.get('/drWho/linked_from_node/:node_id/:relation', function(req, res) {
  if (req.params.node_id == 'any') {
    api.linked_any(req.params.relation).then(resultJson => {
      res.setHeader('Content-Type', 'text/plain');
      res.end(resultJson);
    });
  }else {
    api.linked_from_node(req.params.node_id, req.params.relation).then(resultJson => {
      res.setHeader('Content-Type', 'text/plain');
      res.end(resultJson);
    });
  }
});

app.all('/drWho/get_properties_of_node/:node_id', function(req, res) {
  var data = "";
  req.setEncoding('utf8');
  req.on("data", function(chunk) { data += chunk });
  req.on('end', function() {
    console.log(data)
    api.get_properties(req.params.node_id).then(resultJson => {
      res.setHeader('Content-Type', 'text/plain');
      res.end(resultJson);
    });
  });
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/Index.html');
});


/*
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(msg){

    if (msg == "All_nodes" ) {
      api.All_nodes();
    }
    else if (msg == "nodes_of_type" ) {
      api.nodes_of_type("hero");
    }
    else if (msg == "links_from_node" ) {
      api.links_from_node("Luke");
    }
    else if (msg == "linked_from_node" ) {
      api.linked_from_node("Luke","TEACH");
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
*/


http.listen(8000, function(){
  console.log('listening on *:8000');
});
