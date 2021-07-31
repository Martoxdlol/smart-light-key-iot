const express = require("express")
const { makeTemplates, getTemplate, makeData, autoRender } = require("./templates.js")
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const pathTools = require("path")

const key = "VALERO7272727272"

const app = express()

app.set('trust proxy', 1)

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cookieSession({
  name: 'session',
  keys: ['adfas 23gr87 gy23r7 bj kfbjkasf', 'key sk faskl kadjklfjkasjf asjkqyueiy yas yfya2']
}))

app.use(express.static(pathTools.resolve(__dirname, './public')))

app.use((req,res,next)=>{makeTemplates();next()})

app.get('/login', autoRender('login'))

app.post('/login', (req,res)=>{
  if(req.body.key === key){
    req.session.user = {admin:true}
    res.redirect("/")
  }else{
    res.redirect("/login?err=true")
  }
})

app.get('/logout', (req,res)=>{
  req.session.user = undefined
  res.redirect("/login")
})

app.use((req,res,next)=>{
  if(req.session.user && req.session.user.admin == true){
    next()
  }else{
    autoRender('unauthorized')(req,res)
  }
})

app.get('/', autoRender('index',async (req,res)=>{

}))

app.get('/buildings', autoRender('buildings'))

app.get('/building/:id', autoRender('building'))




app.listen(9006)
