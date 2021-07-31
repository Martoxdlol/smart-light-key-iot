import React from 'react'

export default function(props){
  return <div className="modal-box-container with-bottom-bar">

    <OptionsBar
      right={<a onClick={props.close}>Cerrar</a>}
    />
  </div>
}
