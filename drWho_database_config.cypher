//add label properties to all nodes
MATCH (n)
SET n.label = labels(n)[0]

//set name properties to all nodes

MATCH (a { label: 'Character' })
SET a.name = a.character

MATCH (b { label: 'Episode' })
SET b.name = b.title

MATCH (c { label: 'Actor' })
SET c.name = c.actor

MATCH (d { label: 'Planet' })
SET d.name = d.planet

MATCH (e { label: 'Species' })
SET e.name = e.species

MATCH (f { label: 'Thing' })
SET f.name = f.thing
