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
    for (var i = 0; i < result.records.length ; i++) {
      const singleRecord = result.records[i];
      const node = singleRecord.get(0);
      const node_obj = {
        name: node.labels[0],
        trace:[],
        returns:{"kind":"nested","endpoint":"/nodes_of_type/"+node.labels},

      }
      jsonString += JSON.stringify(node_obj) + ";";

    }
    var arr =  jsonString.slice(0, jsonString.length-1);
    arr = arr.split(";");
    let unique = [...new Set(arr)];
    var nl = ""
    for (var i = 1; i < unique.length - 1; i++) {
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
        name: node.properties.name,
        returns:{"kind":"nested","endpoint":"/links_from_node/"+node.properties.name},
        trace:[]
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
    'MATCH  (a {name: $label}) OPTIONAL MATCH (a {name:$label })-[r]-(b) return type(r), properties(a)',
    {label: node_id}
  );
  return resultPromise.then(result => {
    session.close();
    var propertie_string = [];
    for (var i = 0; i < Object.keys(result.records[0].get(1)).length; i++) {
      obj = {
        name: Object.keys(result.records[0].get(1))[i],
        type: typeof(Object.values(result.records[0].get(1))[i]),
      }
      propertie_string.push(obj);
    }

    var jsonString = "";
    const prop_obj = {
      name: "get_properties",
      trace:[],
      returns:{
        kind:"primitive",
        type: {name:"seq", params:[
          { name:"record",
            fields: propertie_string
            } ]},
        endpoint:"/get_properties_of_node/"+node_id }
    }
    jsonString += JSON.stringify(prop_obj) + ";";


      for (var i = 0; i < result.records.length; i++) {
        const singleRecord = result.records[i];
        const node = singleRecord.get(0);
        if (node != null) {
          const node_obj = {
            name: node,
            trace:[],
            returns:{"kind":"nested","endpoint":"/linked_from_node/"+ node_id + "/"+ node},
          }
          jsonString += JSON.stringify(node_obj) + ";";
        }
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
        id: node.identity.toNumber(),
        name: node.properties.name,
        properties: node.properties,
        trace:[],
        returns:{"kind":"nested","endpoint":"/links_from_node/"+node.properties.name},
      } });
    const jsonString = JSON.stringify(jsonArray);
    return jsonString;
  }).catch(
       (reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
        });
}



function get_properties(node_id){
  const resultPromise = session.run(
    'MATCH (a) WHERE a.name = $node_id  RETURN a',
    {node_id: node_id}
  );
  return resultPromise.then(result => {
    session.close();
    return "[" + JSON.stringify(result.records[0].get(0).properties) + "]";
  });

}






exports.get_properties = get_properties;
exports.All_nodes = All_nodes;
exports.nodes_of_type = nodes_of_type;
exports.links_from_node = links_from_node;
exports.linked_from_node = linked_from_node;
