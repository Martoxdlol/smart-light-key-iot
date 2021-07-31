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
        <h2>Estado acutal: ${global.wifiStatus}</h2>
        <br/>
        <form action="save-config" method="get">
          <label for="ssid">Redes disponibles</label><span style="float:right"><a href="javascript:void(0)" onclick="scanNetworks()">Recargar</a></span>
          <input type="text" name="ssid" id="ssid" value="${global.wifiSsid || ''}" placeholder="Nombre de la red" onchange="ssidChange()" oninput="ssidChange()" onkeydown="ssidChange()" onkeyup="ssidChange()"/>
          <aside>
            <ul id="wifi-results">
            </ul>
          </aside>
          <br/>
          <label for="password">ContraseÃ±a del WiFi</label><span style="float:right"><a id="showpass" href="javascript:void(0)" onclick="viewPassword()">ver</a><a id="hidepass" style="display:none" href="javascript:void(0)" onclick="viewPassword()">ocultar</a></span>
          <input type="password" name="password" id="password" value="${global.wifiPassword || ''}" placeholder="ContraseÃ±a"/>
          <button type="submit" name="save">Guardar configuraciÃ³n</button>
        </form>
      </section>
    </main>
    <footer>
    </footer>
    <script type="text/javascript">
      const ssidInputElement = document.getElementById('ssid');
      var networks = []
      var ssid = ""

      function ssidChange(){
        ssid = ssidInputElement.value
        showNetworks()
      }

      function showSsid(wssid){
        ssid = wssid
        ssidInputElement.value = wssid
        showNetworks()
      }

      function scanNetworks(){
        fetch("/scan-wifi").then(function(r){return r.json()}).then(function(nets){
          networks = nets;
          showNetworks();
        })
      }

      function showNetworks(){
        var baseElem = document.getElementById('wifi-results')
        baseElem.innerHTML = ""
        for (var i = 0; i < networks.length; i++) {
          let elem = document.createElement("li")
          let elem2 = document.createElement("a")
          elem2.href = "javascript:void(0)";
          elem2.innerText = networks[i].ssid;
          elem2.onclick = function(){
            showSsid(elem2.innerText)
          }
          elem.appendChild(elem2)
          if(ssid == networks[i].ssid){
            elem2.classList = ["selected"]
          }
          baseElem.appendChild(elem)
        }
      }

      let viewingPass = false

      function viewPassword(){
        viewingPass = !viewingPass
        if(viewingPass){
          document.getElementById("hidepass").style.display = ""
          document.getElementById("showpass").style.display = "none"
          document.getElementById('password').type = "text"
        }else{
          document.getElementById('password').type = "password"
          document.getElementById("hidepass").style.display = "none"
          document.getElementById("showpass").style.display = ""
        }
      }

      showNetworks()
      scanNetworks()
    </script>
  </body>
</html>
`}