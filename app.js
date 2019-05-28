var http = require('http');
var fs = require('fs');
var api = require('./neo4j');


var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

var io = require('socket.io').listen(server);


const personName = 'Alice';
io.sockets.on('connection', function (socket) {
    api.Age_by_name(personName);
});




server.listen(8000);
