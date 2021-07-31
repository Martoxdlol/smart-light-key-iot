const React = require("react")
const Base = require("./base")


module.exports = function(props){
  return <Base>
    <h1>404 {props.children}</h1>
  </Base>
}
