const neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "azerty"));
const session = driver.session();


function test(personName){

  const resultPromise = session.run(
    'MERGE (a:Person {name: $name}) RETURN a',
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

}

function Age_by_name(personName){

  const resultPromise = session.run(
    'MERGE (a:person {name: $name}) RETURN a ',
    {name: personName}
  );

  resultPromise.then(result => {
    session.close();

    const singleRecord = result.records[0];
    const node = singleRecord.get(0);

    console.log(node.properties.Age);
    // on application exit:
    driver.close();
  });

}


exports.test = test;
exports.Age_by_name = Age_by_name;
