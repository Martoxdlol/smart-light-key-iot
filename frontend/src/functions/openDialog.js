import ReactDOM from 'react-dom'
import React from 'react'

let dialogsOpen = 0

export default function openDialog(title = Date.now()+"", Child, options){
  if(typeof title != "string") throw new TypeError("title must be a string")
  const element = document.createElement('div')
  element.className = 'dialog'
  document.body.appendChild(element)

  const defaultOptions = {
    useHash: true,
    preventClose: false,
  }

  options = {...defaultOptions, ...options}
  const closeBackEnabled = !(options.preventClose || !options.useHash)

  setTimeout(()=>{
    element.style.backgroundColor = "rgba(0,0,0,0.3)"
  },0)

  dialogsOpen++
  document.body.style.overflow = "hidden"

  let dur = 200

  if(options && Number.isInteger(options.duration) && options.duration > 0){
    dur = options.duration
  }

  let backListener
  let isClosed = false
  function close(event,preventHashUpdate){
    if(isClosed) return;
    isClosed = true
    dialogsOpen--
    if(dialogsOpen === 0){
      document.body.style.overflow = ""
    }
    if(closeBackEnabled){
      window.removeEventListener("hashchange", backListener)
    }
    willClose()
    element.style.backgroundColor = "rgba(0,0,0,0.0)"
    setTimeout(()=>{
      document.body.removeChild(element)
    },dur)
    if(!preventHashUpdate && closeBackEnabled){
      try {
        const hash = location.hash
        if(hash){
          let arr = hash.split("#"+title)
          const arrLast = arr[arr.length-1]
          arr.pop()
          const newHash = arr.join("#"+title)+arrLast
          if(newHash != location.hash){

            // if(newHash === ""){
            //   location.hash = "#!"
            // }else{
            //   location.hash = newHash
            // }

            //HOTFIX
            history.back()

            if(location.hash === "" || location.hash === "#"){
              // history.pushState("", document.title, window.location.pathname + window.location.search);
            }else{
              // history.pushState({},'')
            }
          }
        }
      } catch (e) {
          console.error(e);
      }
    }
  }

  try {
    const hash = location.hash
    backListener = e =>  {
      if(location.hash.search("#"+title) == -1){
        close(undefined,true)
        window.removeEventListener("hashchange", backListener)
        // if(location.hash === "" || location.hash === "#") history.pushState({},'')
      }
    }
    if(closeBackEnabled){
      location.href = hash+"#"+title
    }
    window.addEventListener("hashchange", backListener)
  } catch (e) {
    console.error(e)
  }

  let closeCallbacks = []

  function willClose(){
    for (let i = 0; i < closeCallbacks.length; i++) {
      try {
        closeCallbacks[i]()
      } catch (e) {
        console.error(e)
      }
    }
  }

  const reactElem = <Child
    close={close}
    preventClose={options.preventClose}
    addCloseListener={cb=>{
      closeCallbacks.push(cb)
    }}
    removeCloseListener={cb=>{
      let i = 0
      while(i < closeCallbacks.length){
        if(closeCallbacks[i] == cb){
          closeCallbacks.splice(i,1)
        }else{
          i++
        }
      }
    }}
  />
  element.onclick = function(e){
    if(e.target !== element || options.preventClose) return
    close()
  }
  const reactInstance = ReactDOM.render(reactElem, element)
  return {
    close
  }
}
