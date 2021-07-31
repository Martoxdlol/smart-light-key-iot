const React = require("react")
const Base = require("./base")
const { db, dbmem } = require('./../../shared/database')

module.exports = async function(props){
  const offset = parseInt(props.query.offset) || 0
  const limit = parseInt(props.query.limit) || 200

  const buildings = (await db.collection("buildings").offset(offset).limit(limit).get()).docs.map(doc => ({id:doc.id,...doc.data()}))

  return <Base>
    {buildings.map(buildingCard)}
  </Base>
}

function buildingCard(building){
  return <div className="building-card">
    <a key={building.id} href={"/building/"+building.id}>{building.title}</a>
  </div>
}
