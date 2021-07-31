const React = require("react")
const Base = require("./base")

module.exports = function(props){
  return <Base>
    <form action="login" method="POST">
      <input type="text" name="key"/>
    </form>
  </Base>
}
