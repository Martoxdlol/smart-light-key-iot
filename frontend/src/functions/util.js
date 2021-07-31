import React from 'react'

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

exports.makeid = makeid

function launchEvent(name){
  try {
    window.dispatchEvent(new Event(name))
  } catch (e) {
    const customEvent1 = document.createEvent('HTMLEvents')
    customEvent1.initEvent(name, true, true)
    document.dispatchEvent(customEvent1)
  }
}

function pushUrl(url,state = {}){
  history.replaceState(state,"",url)
  if(location.pathname != url){
    location.href = url
  }
}

exports.Link = function(props){
  const to = props.to || props.href
  return <a {...props} onClick={e => {
    e.preventDefault()
    if(props.onClick){
      props.onClick(e)
    }
    pushUrl(to)
  }}/>
}

exports.MenuButton = function(props){
  return <button type="button" className="button-menu" disabled={props.disabled} style={props.style || {}} onClick={props.onClick}>
    <div>{props.icon || ''}</div>
    <div>{props.children}</div>
    <div onClick={e => {
      e.stopPropagation()
      e.preventDefault()
      if(props.onAction){
        props.onAction(e)
      }
    }}>{props.action || ''}</div>
  </button>
}

exports.pushUrl = pushUrl
exports.launchEvent = launchEvent

// debug only
// window.launchEvent = launchEvent




// this.groups = {
//   living: {
//     title: "Living"
//   },
//   kitchen: {
//     title: "Cocina"
//   },
//   bedroom: {
//     title: "Habitación"
//   },
//   restroom: {
//     title: "Baño"
//   }
// }
//
// this.switches = {
//   "3EJ5epfn_A":{
//     name: "Luz general",
//     code:"3EJ5epfn",
//     group: "living",
//     physical: "A",
//     belongs: this.id,
//     state: true,
//   },
//   "3EJ5epfn_B":{
//     name: "Luz techo",
//     code: "3EJ5epfn",
//     group: "kitchen",
//     physical: "B",
//     belongs: this.id,
//     state: true,
//   },
//   "3EJ5epfn_C":{
//     name: "Luz mesada",
//     code: "3EJ5epfn",
//     physical: "C",
//     group: "kitchen",
//     belongs: this.id,
//     state: false,
//   },
//   "2ajeYep7_A":{
//     name: "Luz general",
//     code:"2ajeYep7r",
//     group: "restroom",
//     physical: "A",
//     belongs: this.id,
//     state: false,
//   },
//   "2ajeYep7_B":{
//     name: "Luz espejo",
//     code: "2ajeYep7r",
//     group: "restroom",
//     physical: "B",
//     belongs: this.id,
//     state: false,
//   },
//   "2ajeYep7_C":{
//     name: "Extractor",
//     code: "2ajeYep7r",
//     physical: "C",
//     group: "restroom",
//     belongs: this.id,
//     state: false,
//   },
