const React = require("react")
const Base = require("./base")

module.exports = function(props){
  return <Base>
    <h1>unauthorized</h1>
    <a href="/login">login</a>
  </Base>
}
