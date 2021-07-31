const React = require("react");

const Base = require("./base");

const {
  db,
  dbmem
} = require('./../../shared/database');

module.exports = async function (props) {
  const offset = parseInt(props.query.offset) || 0;
  const limit = parseInt(props.query.limit) || 200;
  const buildings = (await db.collection("buildings").offset(offset).limit(limit).get()).docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return /*#__PURE__*/React.createElement(Base, null, buildings.map(buildingCard));
};

function buildingCard(building) {
  return /*#__PURE__*/React.createElement("div", {
    className: "building-card"
  }, /*#__PURE__*/React.createElement("a", {
    key: building.id,
    href: "/building/" + building.id
  }, building.title));
}