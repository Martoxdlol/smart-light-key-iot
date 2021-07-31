import ReactDOM from 'react-dom'
import React from 'react'

export default function contextmenu(e, options = [],callback){

  //TEST
  // options = [
  //   {label:"Primera",value:"one",action:()=>{}},
  //   {label:"Segunda",value:"two"},
  //   {label:"Tercera",action:()=>{}},
  //   {label:"Cuarta",anyData:1234},
  //   {label:"Quinta",num:"five",action:()=>{}},
  //   {label:"Sexta"},
  //   'Only label option',
  //   'Only label option 2',
  //   undefined
  // ]


  const scrollY = window.scrollY || window.pageYOffset
  const top = ((e.target && e.target.offsetTop) || e.clientY || e.y || e.Y)+scrollY
  const left = (e.target && e.target.offsetLeft && e.target.offsetLeft+0) || e.clientX || e.x || e.X
  const screenWidth = window.innerWidth
  const screenHeight = window.screenHeight
  const bottom = window.innerHeight - top
  const right = screenWidth - left
  const useLeft = left > right
  const useTop = top > bottom
  const minWidth = 260
  const optionHeight = 50
  const minShownOptions = 4
  const minHeight = optionHeight * minShownOptions + moreOptionsHintHeight
  const moreOptionsHintHeight = 10

  let x = useLeft ? left - minWidth : left
  if(useLeft){
    if(x < 0) x = 0
  }else{
    if((x + minWidth) > screenWidth) x = screenWidth - minWidth
  }

  const usableHeightSpace = (useTop ? top : bottom)
  let menuHeight = minHeight-moreOptionsHintHeight
  if(options.length < minShownOptions){
    menuHeight = options.length * optionHeight
  }else if((options.length * optionHeight) > usableHeightSpace){
    menuHeight = Math.floor(usableHeightSpace-moreOptionsHintHeight / optionHeight) * optionHeight+moreOptionsHintHeight
  }else if((options.length * optionHeight) < usableHeightSpace){
    menuHeight = options.length * optionHeight
  }

  let y = useTop ? top - menuHeight : top

  if(useTop){
    if(y < 0) y = 0
  }else{
    if((y + menuHeight) > screenHeight) y = screenHeight - menuHeight
  }


  const element = document.createElement('div')
  element.className = 'contextmenu'
  element.style.top = y+'px'
  element.style.left = x+'px'
  element.style.height = menuHeight+'px'
  element.style.width = minWidth+'px'
  document.body.appendChild(element)


  function close(){
    document.body.removeChild(element)
  }

  let closeListener

  closeListener = e => {
    window.removeEventListener('click',closeListener)
    close()
  }

  setTimeout(() => {
    window.addEventListener('click',closeListener)
  }, 10)

  function clickedOption(option, i, e){
    if(option.action){
      option.action(e)
    }
    if(callback){
      callback(option, i, e)
    }
  }

  ReactDOM.render(<div>
      {options.map((option, i) => {
        if(typeof option == 'string') option = {label:option}
        if(typeof option == 'undefined') option = {label:''}
        return <span key={i} className='contextmenu-option' onClick={e => clickedOption(option, i, e)}>{option.label}</span>
      })}
    </div>, element)
}
