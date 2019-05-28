var http = require('http');
var fs = require('fs');


var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});


var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});


///////////////////////////////////neo4j-part\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(uri = "bolt://localhost:7687", neo4j.auth.basic(user="neo4j", password="azerty"));
const session = driver.session();

const personName = 'Alice';
const resultPromise = session.run(
  'CREATE (a:Person {name: $name}) RETURN a',
  {name: personName}
);

resultPromise.then(result => {
  session.close();

  const singleRecord = result.records[0];
  const node = singleRecord.get(0);

  console.log(node.properties.name);

  // on application exit:
  driver.close();
});






server.listen(8000);
