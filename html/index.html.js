module.exports = function(){return `<!DOCTYPE html>
<html lang="es" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Key Touch</title>
  </head>
  <style media="screen">
    *{
      margin: 0;
      box-sizing: border-box;
      font-family: Helvetica;
      color: #DDD;
      outline: none;
    }

    a{
      color: #0066CC;
      text-decoration: none;
    }

    nav{
      height: 60px;
      border-bottom: 1px solid #333;
      background: #000;

    }

    nav > div{
      padding: 8px 16px;
      max-width: 700px;
      margin: auto;
    }

    nav h1{
      font-size: 22px;
      font-weight: 400;
      line-height: 1.25em;
    }

    nav h2{
      font-size: 16px;
      font-weight: 300;
    }

    main section{
      padding: 20px 16px;
      max-width: 700px;
      margin: auto;
    }

    body{
      background-color: #000;
    }

    input{
      margin: 3px 0px 0px 0px;
      padding: 5px 4px;
      font-size: 16px;
      border: none;
      border-bottom: 1px solid #0066CC;
      width: 100%;
      background-color: #333;
      color: white;
    }

    .appleblue{
      background-color: #0066CC;
    }

    .selected{
      border: 1px solid #0066CC;
    }

    ul{
      padding: 0;
    }

    form ul li{
      list-style: none;
      display: block;
    }

    form ul li a{
      padding: 6px;
      margin: 6px 0px;
      background-color: #333;
      display: block;
      color: white;
    }

    input[type="submit"], button[type="submit"]{
      font-size: 16px;
      border: none;
      background-color: #0066CC;
      color: white;
      width: auto;
      float: right;
      cursor: pointer;
      border-radius: 5px;
      padding: 10px 20px;
      margin-top: 6px;
    }

    .infobox{
      display: block;
      font-size: 18px;
      line-height: 26px;
    }

  </style>
  <body>
    <nav>
      <div>
        <h1>Interruptor de luz inteligente</h1>
        <h2>Configurar conexiÃ³n</h2>
      </div>
    </nav>
    <main>
      <section>
        <span class="infobox">Id del dispositivo: ${global.deviceCode}</span>
        <span class="infobox">Red WiFi: ${global.wifiSsid || ''}</span>
        <span class="infobox">Estado WiFi: ${global.indexHTMLData.wifis}</span>
        <span class="infobox">IP local: ${wifi.getIP().ip}</span>
        <span class="infobox">MAC: ${wifi.getIP().mac}</span>
        <span class="infobox">SeÃ±al: ${global.indexHTMLData.wifiq}%</span>
        <span class="infobox">Servidor: ${global.indexHTMLData.wifis}</span>
        <a href="config" class="infobox">Configurar</a>
      </section>
    </main>
    <footer>
    </footer>
  </body>
</html>
`}