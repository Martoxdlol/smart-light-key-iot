const React = require("react");

const Base = require("./base");

const E404 = require("./e404");

const {
  db,
  dbmem
} = require('./../../shared/database');

module.exports = async function (props) {
  const offset = parseInt(props.query.offset) || 0;
  const limit = parseInt(props.query.limit) || 200;
  const building = (await db.collection("buildings").doc(props.params.id).get()).data();
  if (!building) return /*#__PURE__*/React.createElement(E404, null, "No se encontr\xF3 el edificio");
  return /*#__PURE__*/React.createElement(Base, null, /*#__PURE__*/React.createElement("h1", null, building.title));
};