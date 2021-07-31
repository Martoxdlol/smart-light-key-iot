const React = require("react");

const Base = require("./base");

module.exports = function (props) {
  return /*#__PURE__*/React.createElement(Base, null, /*#__PURE__*/React.createElement("h1", null, "404 ", props.children));
};