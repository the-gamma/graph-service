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
  var trace = "";
  req.setEncoding('utf8');
  req.on("data", function(chunk) { trace += chunk });
  req.on('end', function() {
    api.links_from_node(req.params.node_id, trace).then(resultJson => {
      res.setHeader('Content-Type', 'text/plain');
      res.end(resultJson);
    });
  });
});

app.get('/drWho/links_from_any_node/:label_type', function(req, res) {
    var trace = "";
    req.setEncoding('utf8');
    req.on("data", function(chunk) { trace += chunk });
    req.on('end', function() {
      api.links_from_any_node(req.params.label_type, trace).then(resultJson => {
        res.setHeader('Content-Type', 'text/plain');
        res.end(resultJson);
      });
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

//app.all('/drWho/get_properties_of_node/:node_id', function(req, res) {
//    api.get_properties(req.params.node_id).then(resultJson => {
//      res.setHeader('Content-Type', 'text/plain');
//      res.end(resultJson);
//    });
//});
app.all('/drWho/get_properties_of_node/:node_id', function(req, res) {
  var trace = "";
  req.setEncoding('utf8');
  req.on("data", function(chunk) { trace += chunk });
  req.on('end', function() {
    api.get_properties(trace, req.params.node_id).then(resultJson => {
      res.setHeader('Content-Type', 'text/plain');
      res.end(resultJson);
    });
  });
});





app.get('/', function(req, res){
  res.sendFile(__dirname + '/Index.html');
});



http.listen(8000, function(){
  console.log('listening on *:8000');
});
