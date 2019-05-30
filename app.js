var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var api = require('./neo4j');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/Index.html');
});

app.get('/starwars', function(req, res) {
    api.All_nodes();
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(__dirname + '/starwars.json');


});

app.get('/starwars/nodes_of_type/:type', function(req, res) {
    api.nodes_of_type(req.params.type);
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(__dirname + '/nodes_of_type_'+ req.params.type +'.json');
});

app.get('/starwars/links_from_node/:node_id', function(req, res) {
    api.links_from_node(req.params.node_id);
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(__dirname + '/links_from_node_'+ req.params.node_id +  '.json');
});

app.get('/starwars/linked_from_node/:node-id/:relation', function(req, res) {
    api.linked_from_node(req.params.node_id, req.params.relation);
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(__dirname + '/linked_from_node_'+req.params.node_id +'_'+ req.params.relation + '.json');
});





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

http.listen(8000, function(){
  console.log('listening on *:8000');
});
