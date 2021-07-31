const fs = require('fs')
const serialize = require('serialize-javascript')

const index = fs.readFileSync('./index.html').toString()

const lines = index.split("\n");
const lines2 = []

let j = 0
for(const line of lines){
    console.log(`const char indexHTML_part_${j}[] PROGMEM = ${serialize(line+'\n')};`)
    j++
}

console.log('const int index_length = '+index.length+';');

console.log()
console.log()
console.log()

console.log(`server.sendHeader("Content-Length", String(index_length));`)

for(let i = 0; i < j; i++){
    console.log(`server.sendContent_P(indexHTML_part_${i});`);
}
console.log(`server.sendContent("");`);