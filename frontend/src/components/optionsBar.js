import React from 'react'

export default function(props){
  return <div className="options-bar">
    {props.left}
    <div style={{width:"100%"}}></div>
    {props.right}
  </div>
}
