const { db, dbmem } = require('../../shared/database')

module.exports = async function getPhysicalDevices(code){
  const docs = (await db.collection('physical_devices').where('belongs','==',code).get()).docs
  const devices = []
  for(doc of docs){
    const data = doc.data()
    devices.push({
      switches: data.switches,
      id: doc.id,
      lastSeen: new Date(Date.now() - 90000), //TEST
      hardwareVersion: '1.0', //TEST
      productName: 'Key Touch One', //TEST
      picture: 'https://xea.abcd.ar/resources/Producto2.png', //TEST
      productUrl: 'https://xea.abcd.ar/', //TEST
      switchesInfo: '3 interruptores independientes'
    })
  }
  return devices
}
