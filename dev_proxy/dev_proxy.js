const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const expressApp = express()

expressApp.use('/socket.io', createProxyMiddleware({ target: 'http://localhost:9002', changeOrigin: false, ws: true, }));
expressApp.use('/api', createProxyMiddleware({ target: 'http://localhost:9001', changeOrigin: true }));

const appMiddleware = createProxyMiddleware({ target: 'http://localhost:9000', changeOrigin: true })

expressApp.use('/', (req, res) => {
  const host = req.headers.host || ''

  if(host.search('app') == 0){
    appMiddleware(req, res)
  }else{
    res.redirect('https://xea.abcd.ar')
  }
})

// expressApp.use('/', );


const app = function(req, res, greenlock) {
  expressApp(req,res)
};

module.exports = app;

const greenlockExpress = require("greenlock-express")
const greenlock = require("greenlock").create({
  packageRoot: __dirname,
  configDir: "./greenlock.d",

  // contact for security and critical bug notices
  maintainerEmail: "tomascichero@gmail.com",

  // whether or not to run at cloudscale
  cluster: false
})

greenlock.sites.add({
    subject: "casa.tomascichero.net",
    altnames: ["casa.tomascichero.net","iot.abcd.ar","devices.iot.abcd.ar","app.diot.abcd.ar"]
});

greenlock.sites.add({
    subject: "iot.tomascichero.net",
    altnames: ["iot.tomascichero.net"]
});

const g = greenlockExpress.init({
        packageRoot: __dirname,
        configDir: "./greenlock.d",

        // contact for security and critical bug notices
        maintainerEmail: "tomascichero@gmail.com",

        // whether or not to run at cloudscale
        cluster: false
    })
    // Serves on 80 and 443
    // Get's SSL certificates magically!
    .serve((req, res) => {
      app(req, res, greenlock)
    })
