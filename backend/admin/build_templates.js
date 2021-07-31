const babel = require("@babel/core")
const fs = require("fs")

if(require("os").platform() != "linux"){

const mod = JSON.parse(fs.readFileSync("./admin/templates_src/mod.json"))

const files = fs.readdirSync("./admin/templates_src/")
let t = false

for(const file of files){
  if(file.substring(file.length-3) == ".js"){
    const path = "./admin/templates_src/"+file
    const out = "./admin/templates/"+file
    let stats = {}
    try {
      stats = fs.statSync(path)
    } catch (e) {}
    if(!stats.ctime || !mod[file] || (new Date(mod[file])).getTime() < (new Date(stats.ctime)).getTime()){
        fs.writeFileSync(out,babelDo(fs.readFileSync(path, "utf8"), out))
        console.log("Transpiled",file)
        t = true
        stats = fs.statSync(out)
        mod[file] = stats.ctime
    }else{
      // console.log("Ignoring",file)
    }
  }
}

if(t){
  fs.writeFileSync("./admin/templates_src/mod.json",JSON.stringify(mod))
}

function babelDo(source, filename){
  const { ast } = babel.transformSync(source, { filename, ast: true, code: false });
  const { code, map } = babel.transformFromAstSync(ast, source, {
    filename,
    plugins: ["@babel/plugin-syntax-dynamic-import"],
    presets: ["@babel/react"],
    babelrc: false,
    configFile: false,
  })

  return code
}

}
