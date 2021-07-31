const express = require("express")
const pathTools = require("path")

const app = express()

const staticMiddleware = express.static(pathTools.resolve(__dirname, 'public'))

app.use((req,res,next) => {
  console.log(req.headers)
  staticMiddleware(req,res,next)
})

//...

app.get('/favicon.ico', (req,res)=>{
  res.end("")
})

app.use((req,res) => {
  res.status(404)
  res.end("Error 404")
})

app.listen(9004)
