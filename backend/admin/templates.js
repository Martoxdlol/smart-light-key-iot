const ReactDOMServer = require('react-dom/server')

async function getTemplate(name,data){
  const m = require('./templates/'+name)
  if(typeof m == 'function'){
    try {
      return await m(data)
    } catch (e) {
      return e.toString()
    }
  }
}

function makeData(req,data){
  return {url:req.url,query:req.query,headers:req.headers,pathname:req.pathname,params:req.params,...data}
}

function makeTemplates(){
  const scriptDir = "build_templates"
  require("./"+scriptDir)
}

function autoRender(name,func = ()=>{}){
  return async function(req,res,next){
    const data = {...await func(req,res)}
    try {
      res.end(ReactDOMServer.renderToStaticMarkup(
        await getTemplate(
          name,
          makeData(req,data)
        )
      ))
    } catch (e) {
      res.end(e.toString())
    }
  }
}

exports.makeTemplates = makeTemplates
exports.getTemplate = getTemplate
exports.autoRender = autoRender
exports.makeData = makeData
