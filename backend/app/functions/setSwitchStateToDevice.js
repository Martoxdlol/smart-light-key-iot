const setSwitchState = require('../functions/setSwitchState')
const axios = require('axios')
const querystring = require('querystring')

module.exports = async function(code, state, physical){
  try {
    const m = (code || '').match(/^([A-Za-z0-9]{2,100})(_([ABC]))*$/)
    if(!m) return false
    const phys = physical || m[3] || ''
    const _code = m[1]
    if(!phys.match(/^[ABC]$/)) return false

    const qparams = {
      code: _code,
    }
    qparams[phys.toLocaleLowerCase()] = !!state
    const r = (await axios.get('http://localhost:9005/set_state?'+querystring.stringify(qparams))).data
    if(r == "ok" || r.status == "ok"){
      setSwitchState(code, state, physical)
      return true
    }else{
      return false
    }
  } catch (e) {
    console.error(e.toString())
    return false
  }
}
