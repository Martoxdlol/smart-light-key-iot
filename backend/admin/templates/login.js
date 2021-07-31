const React = require("react");

const Base = require("./base");

module.exports = function (props) {
  return /*#__PURE__*/React.createElement(Base, null, /*#__PURE__*/React.createElement("form", {
    action: "login",
    method: "POST"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "key"
  })));
};