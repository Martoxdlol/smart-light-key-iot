const React = require("react")
const Base = require("./base")
const E404 = require("./e404")
const { db, dbmem } = require('./../../shared/database')

module.exports = async function(props){
  const offset = parseInt(props.query.offset) || 0
  const limit = parseInt(props.query.limit) || 200

  const building = (await db.collection("buildings").doc(props.params.id).get()).data()

  if(!building) return <E404>No se encontró el edificio</E404>

  return <Base>
    <h1>{building.title}</h1>
  </Base>
}
