import React, { Component } from 'react'
import styles from './shipmentOptionsInput.styl'
import { v4 as uuidv4 } from 'uuid'
import SwitchBox from '../../../shared_components/switch_box/switch_box'

//  INPUT:
//  {
//    "Opción 1":400,
//    "Opción 2":300
//   }
//
//

export default class ShipmentOptionsInput extends Component{
  constructor(props){
    super(props)
    const baseOptions = props.options || {}
    this.state = {
      options: ShipmentOptionsInput.convertInputOptions(baseOptions.custom || {}),
      extern: !!baseOptions.extern
    }

    this.addOption = this.addOption.bind(this)
    this.delOption = this.delOption.bind(this)
    this.changeOptionName = this.changeOptionName.bind(this)
    this.changeOptionPrice = this.changeOptionPrice.bind(this)
    this.changeOptionEnabled = this.changeOptionEnabled.bind(this)
    this.changeExtern = this.changeExtern.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  static convertInputOptions(options = {}){
    let out = {}
    for (let i = 0; i < options.length; i++) {
      out[uuidv4()] = options[i]
    }
    return out
  }

  static convertOutputOptions(options){
    let out = []
    const keys = Object.keys(options)
    for (let i = 0; i < keys.length; i++) {
      out.push(options[keys[i]])
    }
    return out
  }

  addOption(){
    let options = this.state.options
    options[uuidv4()] = {name:"Nueva opción", enabled:false, price:300}
    this.setState({options},this.handleChange)
  }

  delOption(id){
    return ()=>{
      let options = this.state.options
      delete options[id]
      this.setState({options},this.handleChange)
    }
  }

  changeOptionName(id){
    return e=>{
      const val = e.target.value
      let options = this.state.options
      options[id] = {...options[id], name:val}
      this.setState({options},this.handleChange)
    }
  }

  changeOptionPrice(id){
    return e=>{
      let val = e.target.value || 0
      val = parseFloat(val)
      val = parseFloat(val.toFixed(2))
      if(val > 999000) val = 999000.00
      if(val < 0) val = 0.00
      let options = this.state.options
      options[id] = {...options[id], price:val}
      this.setState({options},this.handleChange)
    }
  }


  changeOptionEnabled(id){
    return e=>{
      const en = !!e.target.checked
      let options = this.state.options
      options[id] = {...options[id], enabled:en}
      this.setState({options},this.handleChange)
    }
  }

  changeExtern(e){
    this.setState({
      extern: !!e.target.checked
    },this.handleChange)
  }

  handleChange(){
    if(this.props.onChange) this.props.onChange({
      extern: this.state.extern,
      custom: ShipmentOptionsInput.convertOutputOptions(this.state.options)
    })
  }

  componentDidMount(){

  }

  render(){
    const keys = Object.keys(this.state.options)

    return <div>
      <div className={styles.item_container}>
        <SwitchBox onChange={this.changeExtern} checked={this.state.extern}/>
        <input type="text" value={"Arreglar con el vendedor ($0)"} onChange={e=>false}/>
      </div>
      {keys.map(key => {
        return <div className={styles.item_container}>
          <SwitchBox onChange={this.changeOptionEnabled(key)} checked={!!this.state.options[key].enabled}/>
          <input type="text" value={this.state.options[key].name || ""} onChange={this.changeOptionName(key)} placeHolder={"Nombre opción"}/>
          $
          <input type="number" min={0} max={999000} step={0.01} value={this.state.options[key].price || ""} onChange={this.changeOptionPrice(key)} placeHolder={"Precio"}/>
          <i className="material-icons" onClick={this.delOption(key)}>clear</i>
        </div>
      })}
      <button type="button" class={styles.add_btn} onClick={this.addOption}><i className="material-icons">add</i>Agregar</button>
    </div>
  }
}
