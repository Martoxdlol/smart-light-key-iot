import React from 'react'
import OptionsBar from '../components/optionsBar'

export default function(props){
  return <div className="modal-box-container with-bottom-bar">
    <a className="menu-button">Grupo o habitación</a>
    <a className="menu-button">Unión de interruptores</a>
    <OptionsBar
      right={<a onClick={props.close}>Cerrar</a>}
    />
  </div>
}
