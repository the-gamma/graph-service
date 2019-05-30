const neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "azerty"));
const session = driver.session();
const fs = require('fs')


function add_label(){
  const resultPromise = session.run(
    'MATCH (n)  SET n.label = labels(n)[0]' ,
  );

}


function All_nodes(){

  const resultPromise = session.run(
    'MATCH (n) RETURN n LIMIT 25',
  );

  resultPromise.then(result => {
    session.close();
    var jsonString = ""
    for (var i = 0; i < result.records.length; i++) {
      const singleRecord = result.records[i];
      const node = singleRecord.get(0);
      const node_obj = {
        name: node.labels[0],
        returns:{"kind":"nested","endpoint":"/nodes_of_type/"+node.labels},

      }

      jsonString += JSON.stringify(node_obj) + ";";



    }
    var arr =  jsonString.slice(0, jsonString.length-1);
    arr = arr.split(";");
    let unique = [...new Set(arr)];
    var nl = ""
    for (var i = 0; i < unique.length; i++) {
      nl += unique[i] + ",";
    }

    fs.writeFile('./starwars.json', "[" + nl.slice(0, nl.length-1) + "]", err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
    })
    driver.close();
  });

}
function nodes_of_type(label_type){
  add_label();
  const resultPromise = session.run(
    'MATCH (n) WHERE n.label = $label RETURN n LIMIT 25',
    {label: label_type}
  );
  resultPromise.then(result => {
    session.close();
    var jsonString = ""
    for (var i = 0; i < result.records.length; i++) {
      const singleRecord = result.records[i];
      const node = singleRecord.get(0);
      const node_obj = {
        id: node.identity,
        name: node.labels[0],
        properties: node.properties,
        returns:{"kind":"nested","endpoint":"/links_from_node/"+node.properties.name},
      }

      jsonString += JSON.stringify(node_obj)
    }
    var path = "./nodes_of_type_"+ label_type + ".json";
    fs.writeFile(path, jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
    })
    driver.close();
  });

}

function links_from_node(node_id){
  add_label();
  const resultPromise = session.run(
    'MATCH (a {name: $label})-[r]-(b) RETURN type(r)',
    {label: node_id}
  );
  resultPromise.then(result => {
    session.close();
    var jsonString = ""
    for (var i = 0; i < result.records.length; i++) {
      const singleRecord = result.records[i];
      const node = singleRecord.get(0);
      const node_obj = {
        name: node,
        returns:{"kind":"nested","endpoint":"linked_from_node/"+ node_id + "/"+ node},
      }

      jsonString += JSON.stringify(node_obj) + ";";
    }
    var arr =  jsonString.slice(0, jsonString.length-1);
    arr = arr.split(";");
    let unique = [...new Set(arr)];
    var nl = ""
    for (var i = 0; i < unique.length; i++) {
      nl += unique[i] + ",";
    }


    var path = "./links_from_node_"+ node_id + ".json";
    fs.writeFile(path, "[" + nl.slice(0, nl.length-1) + "]", err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
    })
    driver.close();
  });

}
function linked_from_node(name, link){
  add_label();
  const resultPromise = session.run(
    'MATCH (a)-[r]-(b) WHERE type(r) = $link and a.name = $name RETURN b',
    {name: name, link: link}
  );
  resultPromise.then(result => {
    session.close();
    var jsonString = ""
    for (var i = 0; i < result.records.length; i++) {
      const singleRecord = result.records[i];
      const node = singleRecord.get(0);
      const node_obj = {
        id: node.identity,
        name: node.labels[0],
        properties: node.properties,
        returns:{"kind":"nested","endpoint":"/links_from_node/"+name},
      }

      jsonString += JSON.stringify(node_obj) + ",";
    }
    var path = "./linked_from_node_" +name + "_" +link + ".json";
    fs.writeFile(path, "["+ jsonString.slice(0, jsonString.length-1) + "]", err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
    })
    driver.close();
  });

}







exports.All_nodes = All_nodes;
exports.nodes_of_type = nodes_of_type;
exports.links_from_node = links_from_node;
exports.linked_from_node = linked_from_node;
