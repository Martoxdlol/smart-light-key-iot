const React = require("react")
const Base = require("./base")

const chars = "abcdefghijklmnopqrstuvxyz"

module.exports = function(props){
  let l = []

  for(let i = 0; i < 300; i++){
    l.push(chars[getRandomInt(0,24)]+chars[getRandomInt(0,24)]+chars[getRandomInt(0,24)]+chars[getRandomInt(0,24)]+chars[getRandomInt(0,24)])
    l.push(chars[getRandomInt(0,24)]+chars[getRandomInt(0,24)]+chars[getRandomInt(0,24)]+chars[getRandomInt(0,24)])

  }

  function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return <Base>
    <div>
      <a href="/buildings">Edificios</a>
    </div>
    <div>
      <a href="/logout">Salir</a>
    </div>
    <div></div>
    {l.map(n => {
      return <div className="i-box">{n}</div>
    })}

  </Base>
}
