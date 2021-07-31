const React = require("react");

const Base = require("./base");

const chars = "abcdefghijklmnopqrstuvxyz";

module.exports = function (props) {
  let l = [];

  for (let i = 0; i < 300; i++) {
    l.push(chars[getRandomInt(0, 24)] + chars[getRandomInt(0, 24)] + chars[getRandomInt(0, 24)] + chars[getRandomInt(0, 24)] + chars[getRandomInt(0, 24)]);
    l.push(chars[getRandomInt(0, 24)] + chars[getRandomInt(0, 24)] + chars[getRandomInt(0, 24)] + chars[getRandomInt(0, 24)]);
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return /*#__PURE__*/React.createElement(Base, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "/buildings"
  }, "Edificios")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "/logout"
  }, "Salir")), /*#__PURE__*/React.createElement("div", null), l.map(n => {
    return /*#__PURE__*/React.createElement("div", {
      className: "i-box"
    }, n);
  }));
};