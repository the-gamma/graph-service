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
//--list all types of nodes
  const resultPromise = session.run(
    'MATCH (n) RETURN n',
  );

  return resultPromise.then(result => {
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
    jsonString = "[" + nl.slice(0, nl.length-1) + "]";
    return jsonString;
  }).catch(
       (reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
        });
}



function nodes_of_type(label_type){
//--list all nodes of type
  add_label();
  const resultPromise = session.run(
    'MATCH (n) WHERE n.label = $label RETURN n',
    {label: label_type}
  );
  return resultPromise.then(result => {
    session.close();
    const jsonArray = result.records.map(record => {
      const node = record.get(0);
      return {
        id: node.identity,
        name: node.labels[0],
        properties: node.properties,
        returns:{"kind":"nested","endpoint":"/links_from_node/"+node.properties.name},
      } });
    const jsonString = JSON.stringify(jsonArray);
    return jsonString;
  }).catch(
       (reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
        });
}



function links_from_node(node_id){
  //--list all relations linking node with with something
  add_label();
  const resultPromise = session.run(
    'MATCH (a {name: $label})-[r]-(b) RETURN type(r)',
    {label: node_id}
  );
  return resultPromise.then(result => {
    session.close();
    var jsonString = "";
    for (var i = 0; i < result.records.length; i++) {
      const singleRecord = result.records[i];
      const node = singleRecord.get(0);
      const node_obj = {
        name: node,
        returns:{"kind":"nested","endpoint":"/linked_from_node/"+ node_id + "/"+ node},
      }

      jsonString += JSON.stringify(node_obj) + ";";
    }
    var arr =  jsonString.slice(0, jsonString.length-1);
    arr = arr.split(";");
    let unique = [...new Set(arr)];
    var nl = "";
    for (var i = 0; i < unique.length; i++) {
      nl += unique[i] + ",";
    }
    jsonString = "[" + nl.slice(0, nl.length-1) + "]";
    return jsonString;
  }).catch(
       (reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
        });
}



function linked_from_node(name, link){
  //--list all nodes connected to by relation
  add_label();
  const resultPromise = session.run(
    'MATCH (a)-[r]-(b) WHERE type(r) = $link and a.name = $name RETURN b',
    {name: name, link: link}
  );
  return resultPromise.then(result => {
    session.close();
    const jsonArray = result.records.map(record => {
      const node = record.get(0);
      return {
        id: node.identity,
        name: node.labels[0],
        properties: node.properties,
        returns:{"kind":"nested","endpoint":"/links_from_node/"+node.properties.name},
      } });
    const jsonString = JSON.stringify(jsonArray);
    return jsonString;
  }).catch(
       (reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
        });
}







exports.All_nodes = All_nodes;
exports.nodes_of_type = nodes_of_type;
exports.links_from_node = links_from_node;
exports.linked_from_node = linked_from_node;
