import './css/app.css'
import './css/nav.css'
import './css/input.css'
import './css/item-box.css'
import './css/dialogs.css'
import './css/device-config.css'
import './css/option-bar.css'
import './css/physical-devices.css'
import './css/menu.css'
import './css/dropdown.css'
import './css/loader.css'
import ReactDOM from 'react-dom'
import React from 'react'
import Home from './pages/home'
import { launchEvent } from './functions/util'

try {
  history.pushState("", document.title, window.location.pathname + window.location.search);
} catch (e) {

}

/* These are the modifications: */
history.pushState = ( f => function pushState(){
    var ret = f.apply(this, arguments);

    launchEvent('pushstate')
    launchEvent('locationchange')

    return ret;
})(history.pushState);

history.replaceState = ( f => function replaceState(){
    var ret = f.apply(this, arguments);
    launchEvent('replacestate')
    launchEvent('locationchange')

    return ret;
})(history.replaceState);

window.addEventListener('popstate',()=>{
  launchEvent('locationchange')
});

if(!('isFinite' in Number)){
  Number.isFinite = function(num){
    if(!num && num != 0) return false
    if(!(num > 0 || num < 1)) return false
    if(num == Infinity || num == -Infinity) return false
    return true
  }
}

if(!('isInteger' in Number)){
  Number.isInteger = function(num){
    if(!Number.isFinite(num)) return false
    if(Math.floor(num) != num) return false
    return true
  }
}

ReactDOM.render(<Home/>, document.getElementById('root'))
