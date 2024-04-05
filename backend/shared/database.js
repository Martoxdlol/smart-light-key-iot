const asyncRedis = require("async-redis")
const redisClient = asyncRedis.createClient()
const serviceAccount = require("../../interruptor-inteligente-firebase-adminsdk-3kbx8-142765ff35.json")

const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tienon-facad.firebaseio.com"
})


let db = admin.firestore()

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

class DualDatabase{
  constructor(firestoreDB, redisClient){
    this.db = firestoreDB
    this.client = redisClient
  }

  collection(coll){
    if(!DualDatabase.validateId(coll)) throw new TypeError('Invalid collection name ('+coll+')')
    return new DualDatabaseCollection(coll, this)
  }

  static validateId(id = ''){
    return !!(id.match(/^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/))
  }

}

class DualDatabaseCollection{
  constructor(coll, dualDatabase){
    this.collection = coll
    this.firestoreColl = dualDatabase.db.collection(coll)
    this.dualDatabase = dualDatabase
  }

  async add(data){
    const result = await this.firestoreColl.add(data)
    await this.dualDatabase.client.set(this.collection+'/'+result.id,JSON.stringify(data))
    return result
  }

  doc(id){
    if(!DualDatabase.validateId(id)) throw new TypeError('Invalid document id ('+id+')')
    return new DualDatabaseDocument(id,this)
  }
}

class DualDatabaseDocument{
  constructor(id,collection){
    this.id = id
    this.collection = collection
  }

  async create(data){
    const result = await this.collection.firestoreColl.doc(this.id).create(data)
    // await this.collection.dualDatabase.client.set(this.collection.collection+'/'+this.id,JSON.stringify(data))
    await this.collection.dualDatabase.client.del(this.collection.collection+'/'+this.id)
    return result
  }

  async delete(){
    const result = await this.collection.firestoreColl.doc(this.id).delete()
    await this.collection.dualDatabase.client.del(this.collection.collection+'/'+this.id)
    return result
  }

  async set(data){
    const result = await this.collection.firestoreColl.doc(this.id).set(data)
    // await this.collection.dualDatabase.client.set(this.collection.collection+'/'+this.id,JSON.stringify(data))
    await this.collection.dualDatabase.client.del(this.collection.collection+'/'+this.id)
    return result
  }

  async update(data){
    const result = await this.collection.firestoreColl.doc(this.id).update(data)
    // await this.collection.dualDatabase.client.set(this.collection.collection+'/'+this.id,JSON.stringify(data))
    await this.collection.dualDatabase.client.del(this.collection.collection+'/'+this.id)
    return result
  }

  async get(){
    let data = null
    try {
      const t = await this.collection.dualDatabase.client.get(this.collection.collection+'/'+this.id)
      if(t && t != null){
        data = JSON.parse(t)
      }
    } catch (e) {}

    if(data === null){
      const fireDoc = await this.collection.firestoreColl.doc(this.id).get(data)
      data = fireDoc.data()
      this.collection.dualDatabase.client.set(this.collection.collection+'/'+this.id,JSON.stringify(data))
    }
    return {
      id: this.id,
      collection: this.collection,
      db: this.collection.dualDatabase,
      data: function(){
        return data
      }
    }
  }
}

exports.dbmem = new DualDatabase(db, redisClient)
exports.db = db
exports.firestore = admin.firestore
exports.redis = redisClient
