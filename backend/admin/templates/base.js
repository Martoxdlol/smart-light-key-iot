const React = require("react");

module.exports = function (props) {
  return /*#__PURE__*/React.createElement("html", {
    lang: "es",
    dir: "ltr"
  }, /*#__PURE__*/React.createElement("head", null, /*#__PURE__*/React.createElement("meta", {
    charSet: "utf-8"
  }), /*#__PURE__*/React.createElement("title", null, "Admin panel"), /*#__PURE__*/React.createElement("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1"
  }), /*#__PURE__*/React.createElement("link", {
    rel: "preconnect",
    href: "https://fonts.gstatic.com"
  }), /*#__PURE__*/React.createElement("link", {
    rel: "stylesheet",
    href: "/styles.css"
  }), /*#__PURE__*/React.createElement("link", {
    href: "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap",
    rel: "stylesheet"
  })), /*#__PURE__*/React.createElement("body", null, /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/"
  }, "Home")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "/logout"
  }, "Salir")))), props.children));
};