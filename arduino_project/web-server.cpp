#include <ESP8266WebServer.h>  
#include <esp8266httpclient.h>
#include <Arduino.h>  
#include "ArduinoJson.h"
#include "ESP8266WiFi.h"
#include "global.h"
#include "flash.h"
#include "util.h"
#include "tcp-server.h"
#include "command.h"
#include "do-command-action.h"

HTTPClient http;

const char indexHTML_part_0[] PROGMEM = "\u003C!DOCTYPE html\u003E\r\n";
const char indexHTML_part_1[] PROGMEM = "\u003Chtml lang=\"es\" dir=\"ltr\"\u003E\r\n";
const char indexHTML_part_2[] PROGMEM = "  \u003Chead\u003E\r\n";
const char indexHTML_part_3[] PROGMEM = "    \u003Cmeta charset=\"utf-8\"\u003E\r\n";
const char indexHTML_part_4[] PROGMEM = "    \u003Cmeta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"\u003E\r\n";
const char indexHTML_part_5[] PROGMEM = "    \u003Ctitle\u003EKey Touch\u003C\u002Ftitle\u003E\r\n";
const char indexHTML_part_6[] PROGMEM = "  \u003C\u002Fhead\u003E\r\n";
const char indexHTML_part_7[] PROGMEM = "  \u003Cstyle media=\"screen\"\u003E\r\n";
const char indexHTML_part_8[] PROGMEM = "    *{\r\n";
const char indexHTML_part_9[] PROGMEM = "      margin: 0;\r\n";
const char indexHTML_part_10[] PROGMEM = "      box-sizing: border-box;\r\n";
const char indexHTML_part_11[] PROGMEM = "      font-family: Helvetica;\r\n";
const char indexHTML_part_12[] PROGMEM = "      color: #DDD;\r\n";
const char indexHTML_part_13[] PROGMEM = "      outline: none;\r\n";
const char indexHTML_part_14[] PROGMEM = "    }\r\n";
const char indexHTML_part_15[] PROGMEM = "\r\n";
const char indexHTML_part_16[] PROGMEM = "    a{\r\n";
const char indexHTML_part_17[] PROGMEM = "      color: #0066CC;\r\n";
const char indexHTML_part_18[] PROGMEM = "      text-decoration: none;\r\n";
const char indexHTML_part_19[] PROGMEM = "    }\r\n";
const char indexHTML_part_20[] PROGMEM = "\r\n";
const char indexHTML_part_21[] PROGMEM = "    nav{\r\n";
const char indexHTML_part_22[] PROGMEM = "      height: 60px;\r\n";
const char indexHTML_part_23[] PROGMEM = "      border-bottom: 1px solid #333;\r\n";
const char indexHTML_part_24[] PROGMEM = "      background: #000;\r\n";
const char indexHTML_part_25[] PROGMEM = "\r\n";
const char indexHTML_part_26[] PROGMEM = "    }\r\n";
const char indexHTML_part_27[] PROGMEM = "\r\n";
const char indexHTML_part_28[] PROGMEM = "    nav \u003E div{\r\n";
const char indexHTML_part_29[] PROGMEM = "      padding: 8px 16px;\r\n";
const char indexHTML_part_30[] PROGMEM = "      max-width: 700px;\r\n";
const char indexHTML_part_31[] PROGMEM = "      margin: auto;\r\n";
const char indexHTML_part_32[] PROGMEM = "    }\r\n";
const char indexHTML_part_33[] PROGMEM = "\r\n";
const char indexHTML_part_34[] PROGMEM = "    nav h1{\r\n";
const char indexHTML_part_35[] PROGMEM = "      font-size: 22px;\r\n";
const char indexHTML_part_36[] PROGMEM = "      font-weight: 400;\r\n";
const char indexHTML_part_37[] PROGMEM = "      line-height: 1.25em;\r\n";
const char indexHTML_part_38[] PROGMEM = "    }\r\n";
const char indexHTML_part_39[] PROGMEM = "\r\n";
const char indexHTML_part_40[] PROGMEM = "    nav h2{\r\n";
const char indexHTML_part_41[] PROGMEM = "      font-size: 16px;\r\n";
const char indexHTML_part_42[] PROGMEM = "      font-weight: 300;\r\n";
const char indexHTML_part_43[] PROGMEM = "    }\r\n";
const char indexHTML_part_44[] PROGMEM = "\r\n";
const char indexHTML_part_45[] PROGMEM = "    main section{\r\n";
const char indexHTML_part_46[] PROGMEM = "      padding: 20px 16px;\r\n";
const char indexHTML_part_47[] PROGMEM = "      max-width: 700px;\r\n";
const char indexHTML_part_48[] PROGMEM = "      margin: auto;\r\n";
const char indexHTML_part_49[] PROGMEM = "    }\r\n";
const char indexHTML_part_50[] PROGMEM = "\r\n";
const char indexHTML_part_51[] PROGMEM = "    body{\r\n";
const char indexHTML_part_52[] PROGMEM = "      background-color: #000;\r\n";
const char indexHTML_part_53[] PROGMEM = "    }\r\n";
const char indexHTML_part_54[] PROGMEM = "\r\n";
const char indexHTML_part_55[] PROGMEM = "    input{\r\n";
const char indexHTML_part_56[] PROGMEM = "      margin: 3px 0px 0px 0px;\r\n";
const char indexHTML_part_57[] PROGMEM = "      padding: 5px 4px;\r\n";
const char indexHTML_part_58[] PROGMEM = "      font-size: 16px;\r\n";
const char indexHTML_part_59[] PROGMEM = "      border: none;\r\n";
const char indexHTML_part_60[] PROGMEM = "      border-bottom: 1px solid #0066CC;\r\n";
const char indexHTML_part_61[] PROGMEM = "      width: 100%;\r\n";
const char indexHTML_part_62[] PROGMEM = "      background-color: #333;\r\n";
const char indexHTML_part_63[] PROGMEM = "      color: white;\r\n";
const char indexHTML_part_64[] PROGMEM = "    }\r\n";
const char indexHTML_part_65[] PROGMEM = "\r\n";
const char indexHTML_part_66[] PROGMEM = "    .appleblue{\r\n";
const char indexHTML_part_67[] PROGMEM = "      background-color: #0066CC;\r\n";
const char indexHTML_part_68[] PROGMEM = "    }\r\n";
const char indexHTML_part_69[] PROGMEM = "\r\n";
const char indexHTML_part_70[] PROGMEM = "    .selected{\r\n";
const char indexHTML_part_71[] PROGMEM = "      border: 1px solid #0066CC;\r\n";
const char indexHTML_part_72[] PROGMEM = "    }\r\n";
const char indexHTML_part_73[] PROGMEM = "\r\n";
const char indexHTML_part_74[] PROGMEM = "    ul{\r\n";
const char indexHTML_part_75[] PROGMEM = "      padding: 0;\r\n";
const char indexHTML_part_76[] PROGMEM = "    }\r\n";
const char indexHTML_part_77[] PROGMEM = "\r\n";
const char indexHTML_part_78[] PROGMEM = "    form ul li{\r\n";
const char indexHTML_part_79[] PROGMEM = "      list-style: none;\r\n";
const char indexHTML_part_80[] PROGMEM = "      display: block;\r\n";
const char indexHTML_part_81[] PROGMEM = "    }\r\n";
const char indexHTML_part_82[] PROGMEM = "\r\n";
const char indexHTML_part_83[] PROGMEM = "    form ul li a{\r\n";
const char indexHTML_part_84[] PROGMEM = "      padding: 6px;\r\n";
const char indexHTML_part_85[] PROGMEM = "      margin: 6px 0px;\r\n";
const char indexHTML_part_86[] PROGMEM = "      background-color: #333;\r\n";
const char indexHTML_part_87[] PROGMEM = "      display: block;\r\n";
const char indexHTML_part_88[] PROGMEM = "      color: white;\r\n";
const char indexHTML_part_89[] PROGMEM = "    }\r\n";
const char indexHTML_part_90[] PROGMEM = "\r\n";
const char indexHTML_part_91[] PROGMEM = "    input[type=\"submit\"], button[type=\"submit\"]{\r\n";
const char indexHTML_part_92[] PROGMEM = "      font-size: 16px;\r\n";
const char indexHTML_part_93[] PROGMEM = "      border: none;\r\n";
const char indexHTML_part_94[] PROGMEM = "      background-color: #0066CC;\r\n";
const char indexHTML_part_95[] PROGMEM = "      color: white;\r\n";
const char indexHTML_part_96[] PROGMEM = "      width: auto;\r\n";
const char indexHTML_part_97[] PROGMEM = "      float: right;\r\n";
const char indexHTML_part_98[] PROGMEM = "      cursor: pointer;\r\n";
const char indexHTML_part_99[] PROGMEM = "      border-radius: 5px;\r\n";
const char indexHTML_part_100[] PROGMEM = "      padding: 10px 20px;\r\n";
const char indexHTML_part_101[] PROGMEM = "      margin-top: 6px;\r\n";
const char indexHTML_part_102[] PROGMEM = "    }\r\n";
const char indexHTML_part_103[] PROGMEM = "\r\n";
const char indexHTML_part_104[] PROGMEM = "    .infobox{\r\n";
const char indexHTML_part_105[] PROGMEM = "      display: block;\r\n";
const char indexHTML_part_106[] PROGMEM = "      font-size: 18px;\r\n";
const char indexHTML_part_107[] PROGMEM = "      line-height: 26px;\r\n";
const char indexHTML_part_108[] PROGMEM = "    }\r\n";
const char indexHTML_part_109[] PROGMEM = "\r\n";
const char indexHTML_part_110[] PROGMEM = "\r\n";
const char indexHTML_part_111[] PROGMEM = "  \u003C\u002Fstyle\u003E\r\n";
const char indexHTML_part_112[] PROGMEM = "  \u003Cbody\u003E\r\n";
const char indexHTML_part_113[] PROGMEM = "    \u003Cnav\u003E\r\n";
const char indexHTML_part_114[] PROGMEM = "      \u003Cdiv\u003E\r\n";
const char indexHTML_part_115[] PROGMEM = "        \u003Ch1\u003EInterruptor de luz inteligente\u003C\u002Fh1\u003E\r\n";
const char indexHTML_part_116[] PROGMEM = "        \u003Ch2\u003EConfigurar conexión\u003C\u002Fh2\u003E\r\n";
const char indexHTML_part_117[] PROGMEM = "      \u003C\u002Fdiv\u003E\r\n";
const char indexHTML_part_118[] PROGMEM = "    \u003C\u002Fnav\u003E\r\n";
const char indexHTML_part_119[] PROGMEM = "    \u003Cmain\u003E\r\n";
const char indexHTML_part_120[] PROGMEM = "      \u003Csection\u003E\r\n";
const char indexHTML_part_121[] PROGMEM = "        \u003Ch2\u003EEstado acutal: \u003Cspan id=\"wifistatus\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fh2\u003E\r\n";
const char indexHTML_part_122[] PROGMEM = "        \u003Cspan class=\"infobox\"\u003EId del dispositivo: \u003Cspan id=\"code\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\r\n";
const char indexHTML_part_123[] PROGMEM = "        \u003Cspan class=\"infobox\"\u003ERed WiFi: \u003Cspan id=\"actualssid\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\r\n";
const char indexHTML_part_124[] PROGMEM = "        \u003Cspan class=\"infobox\"\u003EEstado WiFi: \u003Cspan id=\"wifistatus2\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\r\n";
const char indexHTML_part_125[] PROGMEM = "        \u003Cspan class=\"infobox\"\u003EIP local: \u003Cspan id=\"ip\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\r\n";
const char indexHTML_part_126[] PROGMEM = "        \u003Cspan class=\"infobox\"\u003EMAC: \u003Cspan id=\"mac\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\r\n";
const char indexHTML_part_127[] PROGMEM = "        \u003Cspan class=\"infobox\"\u003ESeñal: \u003Cspan id=\"signal\"\u003E\u003C\u002Fspan\u003E%\u003C\u002Fspan\u003E\r\n";
const char indexHTML_part_128[] PROGMEM = "        \u003Cspan class=\"infobox\"\u003EServidor: \u003Cspan id=\"server\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\r\n";
const char indexHTML_part_129[] PROGMEM = "      \u003C\u002Fsection\u003E\r\n";
const char indexHTML_part_130[] PROGMEM = "      \u003Csection\u003E\r\n";
const char indexHTML_part_131[] PROGMEM = "        \u003Cbr\u002F\u003E\r\n";
const char indexHTML_part_132[] PROGMEM = "        \u003Cform action=\"save-config\" method=\"get\"\u003E\r\n";
const char indexHTML_part_133[] PROGMEM = "          \u003Clabel for=\"ssid\"\u003ERedes disponibles\u003C\u002Flabel\u003E\u003Cspan style=\"float:right\"\u003E\u003Ca href=\"javascript:void(0)\" onclick=\"scanNetworks()\"\u003ERecargar\u003C\u002Fa\u003E\u003C\u002Fspan\u003E\r\n";
const char indexHTML_part_134[] PROGMEM = "          \u003Cinput type=\"text\" name=\"ssid\" id=\"ssid\" value=\"\" placeholder=\"Nombre de la red\" onchange=\"ssidChange()\" oninput=\"ssidChange()\" onkeydown=\"ssidChange()\" onkeyup=\"ssidChange()\"\u002F\u003E\r\n";
const char indexHTML_part_135[] PROGMEM = "          \u003Caside\u003E\r\n";
const char indexHTML_part_136[] PROGMEM = "            \u003Cul id=\"wifi-results\"\u003E\r\n";
const char indexHTML_part_137[] PROGMEM = "            \u003C\u002Ful\u003E\r\n";
const char indexHTML_part_138[] PROGMEM = "          \u003C\u002Faside\u003E\r\n";
const char indexHTML_part_139[] PROGMEM = "          \u003Cbr\u002F\u003E\r\n";
const char indexHTML_part_140[] PROGMEM = "          \u003Clabel for=\"password\"\u003EContraseña del WiFi\u003C\u002Flabel\u003E\u003Cspan style=\"float:right\"\u003E\u003Ca id=\"showpass\" href=\"javascript:void(0)\" onclick=\"viewPassword()\"\u003Ever\u003C\u002Fa\u003E\u003Ca id=\"hidepass\" style=\"display:none\" href=\"javascript:void(0)\" onclick=\"viewPassword()\"\u003Eocultar\u003C\u002Fa\u003E\u003C\u002Fspan\u003E\r\n";
const char indexHTML_part_141[] PROGMEM = "          \u003Cinput type=\"password\" name=\"password\" id=\"password\" value=\"\" placeholder=\"Contraseña\"\u002F\u003E\r\n";
const char indexHTML_part_142[] PROGMEM = "          \u003Cbutton type=\"submit\" name=\"save\"\u003EGuardar configuración\u003C\u002Fbutton\u003E\r\n";
const char indexHTML_part_143[] PROGMEM = "        \u003C\u002Fform\u003E\r\n";
const char indexHTML_part_144[] PROGMEM = "\t\t\u003Cbr\u002F\u003E\u003Cbr\u002F\u003E\u003Cbr\u002F\u003E\u003Cbr\u002F\u003E\u003Cbr\u002F\u003E\r\n";
const char indexHTML_part_145[] PROGMEM = "\t\t\u003Cform action=\"do-action\" method=\"get\"\u003E\r\n";
const char indexHTML_part_146[] PROGMEM = "          \u003Clabel for=\"ssid\"\u003ECódigo de acción automática (ver app)\u003C\u002Flabel\u003E\r\n";
const char indexHTML_part_147[] PROGMEM = "          \u003Cinput type=\"text\" name=\"action_code\" id=\"action_code\" value=\"\" placeholder=\"ej: Az0lj75EF\"\u002F\u003E\r\n";
const char indexHTML_part_148[] PROGMEM = "          \u003Cbutton type=\"submit\" name=\"save\"\u003EEnviar\u003C\u002Fbutton\u003E\r\n";
const char indexHTML_part_149[] PROGMEM = "        \u003C\u002Fform\u003E\r\n";
const char indexHTML_part_150[] PROGMEM = "      \u003C\u002Fsection\u003E\r\n";
const char indexHTML_part_151[] PROGMEM = "    \u003C\u002Fmain\u003E\r\n";
const char indexHTML_part_152[] PROGMEM = "    \u003Cbr\u002F\u003E\r\n";
const char indexHTML_part_153[] PROGMEM = "    \u003Cbr\u002F\u003E\r\n";
const char indexHTML_part_154[] PROGMEM = "    \u003Cbr\u002F\u003E\r\n";
const char indexHTML_part_155[] PROGMEM = "    \u003Cbr\u002F\u003E\r\n";
const char indexHTML_part_156[] PROGMEM = "    \u003Cfooter\u003E\r\n";
const char indexHTML_part_157[] PROGMEM = "    \u003C\u002Ffooter\u003E\r\n";
const char indexHTML_part_158[] PROGMEM = "    \u003Cscript type=\"text\u002Fjavascript\"\u003E\r\n";
const char indexHTML_part_159[] PROGMEM = "      const ssidInputElement = document.getElementById('ssid');\r\n";
const char indexHTML_part_160[] PROGMEM = "      var networks = []\r\n";
const char indexHTML_part_161[] PROGMEM = "      var ssid = \"\"\r\n";
const char indexHTML_part_162[] PROGMEM = "\r\n";
const char indexHTML_part_163[] PROGMEM = "      function ssidChange(){\r\n";
const char indexHTML_part_164[] PROGMEM = "        ssid = ssidInputElement.value\r\n";
const char indexHTML_part_165[] PROGMEM = "        showNetworks()\r\n";
const char indexHTML_part_166[] PROGMEM = "      }\r\n";
const char indexHTML_part_167[] PROGMEM = "\r\n";
const char indexHTML_part_168[] PROGMEM = "      function showSsid(wssid){\r\n";
const char indexHTML_part_169[] PROGMEM = "        ssid = wssid\r\n";
const char indexHTML_part_170[] PROGMEM = "        ssidInputElement.value = wssid\r\n";
const char indexHTML_part_171[] PROGMEM = "        showNetworks()\r\n";
const char indexHTML_part_172[] PROGMEM = "      }\r\n";
const char indexHTML_part_173[] PROGMEM = "\r\n";
const char indexHTML_part_174[] PROGMEM = "      function getInfo(){\r\n";
const char indexHTML_part_175[] PROGMEM = "        fetch(\"\u002Finfo\").then(function(r){return r.json()}).then(function(info){\r\n";
const char indexHTML_part_176[] PROGMEM = "          document.getElementById('code').innerText = info.code\r\n";
const char indexHTML_part_177[] PROGMEM = "          document.getElementById('actualssid').innerText = info.actualssid\r\n";
const char indexHTML_part_178[] PROGMEM = "          document.getElementById('wifistatus').innerText = info.wifistatus\r\n";
const char indexHTML_part_179[] PROGMEM = "          document.getElementById('wifistatus2').innerText = info.wifistatus\r\n";
const char indexHTML_part_180[] PROGMEM = "          document.getElementById('ip').innerText = info.ip\r\n";
const char indexHTML_part_181[] PROGMEM = "          document.getElementById('mac').innerText = info.mac\r\n";
const char indexHTML_part_182[] PROGMEM = "          document.getElementById('signal').innerText = info.signal\r\n";
const char indexHTML_part_183[] PROGMEM = "          document.getElementById('server').innerText = info.server\r\n";
const char indexHTML_part_184[] PROGMEM = "          document.getElementById('ssid').value = info.actualssid\r\n";
const char indexHTML_part_185[] PROGMEM = "          document.getElementById('password').value = info.password\r\n";
const char indexHTML_part_186[] PROGMEM = "        })\r\n";
const char indexHTML_part_187[] PROGMEM = "      }\r\n";
const char indexHTML_part_188[] PROGMEM = "\r\n";
const char indexHTML_part_189[] PROGMEM = "      function scanNetworks(){\r\n";
const char indexHTML_part_190[] PROGMEM = "        fetch(\"\u002Fscan-wifi\").then(function(r){return r.json()}).then(function(nets){\r\n";
const char indexHTML_part_191[] PROGMEM = "          networks = nets;\r\n";
const char indexHTML_part_192[] PROGMEM = "          showNetworks();\r\n";
const char indexHTML_part_193[] PROGMEM = "        })\r\n";
const char indexHTML_part_194[] PROGMEM = "      }\r\n";
const char indexHTML_part_195[] PROGMEM = "\r\n";
const char indexHTML_part_196[] PROGMEM = "      function showNetworks(){\r\n";
const char indexHTML_part_197[] PROGMEM = "        var baseElem = document.getElementById('wifi-results')\r\n";
const char indexHTML_part_198[] PROGMEM = "        baseElem.innerHTML = \"\"\r\n";
const char indexHTML_part_199[] PROGMEM = "        for (var i = 0; i \u003C networks.length; i++) {\r\n";
const char indexHTML_part_200[] PROGMEM = "          if(typeof networks[i] == \"string\") networks[i] = JSON.parse(networks[i]);\r\n";
const char indexHTML_part_201[] PROGMEM = "          let elem = document.createElement(\"li\")\r\n";
const char indexHTML_part_202[] PROGMEM = "          let elem2 = document.createElement(\"a\")\r\n";
const char indexHTML_part_203[] PROGMEM = "          elem2.href = \"javascript:void(0)\";\r\n";
const char indexHTML_part_204[] PROGMEM = "          elem2.innerText = networks[i].ssid;\r\n";
const char indexHTML_part_205[] PROGMEM = "          elem2.onclick = function(){\r\n";
const char indexHTML_part_206[] PROGMEM = "            showSsid(elem2.innerText)\r\n";
const char indexHTML_part_207[] PROGMEM = "          }\r\n";
const char indexHTML_part_208[] PROGMEM = "          elem.appendChild(elem2)\r\n";
const char indexHTML_part_209[] PROGMEM = "          if(ssid == networks[i].ssid){\r\n";
const char indexHTML_part_210[] PROGMEM = "            elem2.classList = [\"selected\"]\r\n";
const char indexHTML_part_211[] PROGMEM = "          }\r\n";
const char indexHTML_part_212[] PROGMEM = "          baseElem.appendChild(elem)\r\n";
const char indexHTML_part_213[] PROGMEM = "        }\r\n";
const char indexHTML_part_214[] PROGMEM = "      }\r\n";
const char indexHTML_part_215[] PROGMEM = "\r\n";
const char indexHTML_part_216[] PROGMEM = "      let viewingPass = false\r\n";
const char indexHTML_part_217[] PROGMEM = "\r\n";
const char indexHTML_part_218[] PROGMEM = "      function viewPassword(){\r\n";
const char indexHTML_part_219[] PROGMEM = "        viewingPass = !viewingPass\r\n";
const char indexHTML_part_220[] PROGMEM = "        if(viewingPass){\r\n";
const char indexHTML_part_221[] PROGMEM = "          document.getElementById(\"hidepass\").style.display = \"\"\r\n";
const char indexHTML_part_222[] PROGMEM = "          document.getElementById(\"showpass\").style.display = \"none\"\r\n";
const char indexHTML_part_223[] PROGMEM = "          document.getElementById('password').type = \"text\"\r\n";
const char indexHTML_part_224[] PROGMEM = "        }else{\r\n";
const char indexHTML_part_225[] PROGMEM = "          document.getElementById('password').type = \"password\"\r\n";
const char indexHTML_part_226[] PROGMEM = "          document.getElementById(\"hidepass\").style.display = \"none\"\r\n";
const char indexHTML_part_227[] PROGMEM = "          document.getElementById(\"showpass\").style.display = \"\"\r\n";
const char indexHTML_part_228[] PROGMEM = "        }\r\n";
const char indexHTML_part_229[] PROGMEM = "      }\r\n";
const char indexHTML_part_230[] PROGMEM = "\r\n";
const char indexHTML_part_231[] PROGMEM = "      showNetworks()\r\n";
const char indexHTML_part_232[] PROGMEM = "      scanNetworks()\r\n";
const char indexHTML_part_233[] PROGMEM = "      getInfo()\r\n";
const char indexHTML_part_234[] PROGMEM = "    \u003C\u002Fscript\u003E\r\n";
const char indexHTML_part_235[] PROGMEM = "  \u003C\u002Fbody\u003E\r\n";
const char indexHTML_part_236[] PROGMEM = "\u003C\u002Fhtml\u003E\r\n";
const char indexHTML_part_237[] PROGMEM = "\n";
const int index_length = 7007;


void handleRoot();              // function prototypes for HTTP handlers
void handleNotFound();
void scanWifis();
void saveConfig();
void sendInfo();
void sendActionCode();
void updatePassThrow();

ESP8266WebServer server(80);

void webServerBegin(){
  server.on("/", handleRoot);
  server.on("/scan-wifi", scanWifis);
  server.on("/save-config", saveConfig);
  server.on("/info", sendInfo);
  server.on("/do-action", sendActionCode);
  server.on("/send-code", sendActionCode);
  server.on("/index.html", handleRoot);
  server.on("/updater", updatePassThrow);

  server.onNotFound(handleNotFound);        // When a client requests an unknown URI (i.e. something other than "/"), call function "handleNotFound"

  server.begin();                           // Actually start the server
  Serial.println("HTTP server started");
}

void updatePassThrow(){
  String host = server.arg("host");
  String path = server.arg("path");
  String port = server.arg("port");
  Serial.println("UPDATE REQUEST");
  Serial.println(host);
  Serial.println(path);
  String u = String("http://")+host+String(":")+port+String("/")+path;
  Serial.println(u);
  http.begin(u);
  int code = http.GET();
  Serial.print("C length: ");Serial.println(http.header("content-length"));
  server.setContentLength(http.header("Content-length").toInt());
  if(code != 200){
    server.send(404,"text/plain"," ");
  }
  Serial.println("BEGIN HTTP REQ STREAM");
  unsigned long z = 0;
  unsigned long m = millis();
  while (http.connected() || m+400 > millis())
  {
    if(http.getStream().available()){
      char c[1] = { http.getStream().read() };
      server.sendContent(c,1);
      z++;
      if(z > 4200001){
        server.sendContent("");
        break;
      }
    }else if(m+50000 < millis()){
        server.sendContent("");
        break;
    }
  }
  server.sendContent("");
  Serial.println("END HTTP REQ STREAM");
  Serial.println(z);

  //ESP8266WebServer
}

void sendInfo(){
  const size_t CAPACITY = JSON_OBJECT_SIZE(24);
  StaticJsonDocument<CAPACITY> doc;

  JsonObject object = doc.to<JsonObject>();
  object["code"] = String(deviceCode);
  object["actualssid"] = String(ssid);
  object["wifistatus"] = String(wifiConnected ? "Conectado" : "Desconectado");
  object["ip"] = WiFi.localIP().toString();
  object["mac"] = String(WiFi.macAddress());
  int dbm = WiFi.RSSI();
  int q = (2 * (dbm+100))/100;
  object["signal"] = String(dbm < -100 ? 0 : (dbm >= 50 ? 1 : q),0);
  object["server"] = String("Desconectado");
  object["password"] = String(password);

  /*document.getElementById('code').innerText = info.code
  document.getElementById('actualssid').innerText = info.actualssid
  document.getElementById('wifistatus').innerText = info.wifistatus
  document.getElementById('ip').innerText = info.ip
  document.getElementById('mac').innerText = info.mac
  document.getElementById('signal').innerText = info.signal
  document.getElementById('server').innerText = info.server
  document.getElementById('password').value = info.password*/

  char buf[1024];
  serializeJson(doc,buf);
  server.send(200,"text/plain", String(buf));
}

void saveConfig(){
  String newSsid = server.arg("ssid");
  String newPass = server.arg("password");

  if(newSsid.length() <= 0){
    server.send(200,"text/html", String("<html><head><title>Config. guardada</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><style>*{font-family:Arial}</style></head><body><h1>Configuraci&oacute;n no guardada: el nombre de la red (ssid) es muy corto.</h1></body></html>"));
    Serial.println("WEB WIFI CREDENTIALS ERR ssid len min");
  }else if(newSsid.length() > 32){
    server.send(200,"text/html", String("<html><head><title>Config. guardada</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><style>*{font-family:Arial}</style></head><body><h1>Configuraci&oacute;n no guardada: el nombre de la red (ssid) es muy largo. Max. 32 caracteres.</h1></body></html>"));
    Serial.println("WEB WIFI CREDENTIALS ERR ssid len max");
  }else if(password.length() > 64){
    server.send(200,"text/html", String("<html><head><title>Config. guardada</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><style>*{font-family:Arial}</style></head><body><h1>Configuraci&oacute;n no guardada: la contraseña es muy larga. Max. 64 caracteres.</h1></body></html>"));
    Serial.println("WEB WIFI CREDENTIALS ERR pass len");
  }else{
    ssid = newSsid;
    password = newPass;
    saveToFlash();
    server.send(200,"text/html", String("<html><head><title>Config. guardada</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><style>*{font-family:Arial}</style></head><body><h1>Configuraci&oacute;n guardada</h1></body></html>"));
   
    Serial.println("SAVED WIFI CREDENTIALS FROM WEB SERVER");

    markSpreadWifiCredentialsRequired();
  }
}

void sendActionCode(){
  String actionCode = server.arg("action_code");
  if(actionCode.length() >= 0 && actionCode.length() <= 160){
    Command r = Command("SEND_ACTION_CODE",actionCode);
    r.isJson = false;
    sendToServer(r);
    Serial.print("Código de acción automática enviado al servidor: ");Serial.println(actionCode);
  }
  server.send(200,"text/html", String("<html><head><title>Enviado correctamente</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><style>*{font-family:Arial}</style></head><body><h1>Se envi&oacute; el c&oacute;digo. Revise la app.</h1></body></html>"));
}

void scanWifis(){
  int n = WiFi.scanNetworks();
  const size_t CAPACITY = JSON_ARRAY_SIZE(30);
  StaticJsonDocument<CAPACITY> doc;
  JsonArray array = doc.to<JsonArray>();
  if (n == 0) {

  } else {
    for (int i = 0; i < n && i < 10; ++i) {

      const size_t CAPACITY = JSON_OBJECT_SIZE(6);
      StaticJsonDocument<CAPACITY> doc2;

      JsonObject object = doc2.to<JsonObject>();
      object["ssid"] = String(WiFi.SSID(i));
      object["rssi"] = String(WiFi.RSSI(i));
      WifiNetwork net = matchWifiName(String(WiFi.SSID(i)));
      if(!net.matchOk){
        array.add(doc2);  
      }   
    }
  }
  char buf[1024];
  serializeJson(doc,buf);
  Serial.print("Sending wifis: ");
  Serial.println(n);
  Serial.print("  -  ");
  Serial.println(buf);
  server.send(200,"text/plain", String(buf));
}


void handleRoot() {
  server.sendHeader("Content-Length", String(index_length));
  server.sendContent_P(indexHTML_part_0);
  server.sendContent_P(indexHTML_part_1);
  server.sendContent_P(indexHTML_part_2);
  server.sendContent_P(indexHTML_part_3);
  server.sendContent_P(indexHTML_part_4);
  server.sendContent_P(indexHTML_part_5);
  server.sendContent_P(indexHTML_part_6);
  server.sendContent_P(indexHTML_part_7);
  server.sendContent_P(indexHTML_part_8);
  server.sendContent_P(indexHTML_part_9);
  server.sendContent_P(indexHTML_part_10);
  server.sendContent_P(indexHTML_part_11);
  server.sendContent_P(indexHTML_part_12);
  server.sendContent_P(indexHTML_part_13);
  server.sendContent_P(indexHTML_part_14);
  server.sendContent_P(indexHTML_part_15);
  server.sendContent_P(indexHTML_part_16);
  server.sendContent_P(indexHTML_part_17);
  server.sendContent_P(indexHTML_part_18);
  server.sendContent_P(indexHTML_part_19);
  server.sendContent_P(indexHTML_part_20);
  server.sendContent_P(indexHTML_part_21);
  server.sendContent_P(indexHTML_part_22);
  server.sendContent_P(indexHTML_part_23);
  server.sendContent_P(indexHTML_part_24);
  server.sendContent_P(indexHTML_part_25);
  server.sendContent_P(indexHTML_part_26);
  server.sendContent_P(indexHTML_part_27);
  server.sendContent_P(indexHTML_part_28);
  server.sendContent_P(indexHTML_part_29);
  server.sendContent_P(indexHTML_part_30);
  server.sendContent_P(indexHTML_part_31);
  server.sendContent_P(indexHTML_part_32);
  server.sendContent_P(indexHTML_part_33);
  server.sendContent_P(indexHTML_part_34);
  server.sendContent_P(indexHTML_part_35);
  server.sendContent_P(indexHTML_part_36);
  server.sendContent_P(indexHTML_part_37);
  server.sendContent_P(indexHTML_part_38);
  server.sendContent_P(indexHTML_part_39);
  server.sendContent_P(indexHTML_part_40);
  server.sendContent_P(indexHTML_part_41);
  server.sendContent_P(indexHTML_part_42);
  server.sendContent_P(indexHTML_part_43);
  server.sendContent_P(indexHTML_part_44);
  server.sendContent_P(indexHTML_part_45);
  server.sendContent_P(indexHTML_part_46);
  server.sendContent_P(indexHTML_part_47);
  server.sendContent_P(indexHTML_part_48);
  server.sendContent_P(indexHTML_part_49);
  server.sendContent_P(indexHTML_part_50);
  server.sendContent_P(indexHTML_part_51);
  server.sendContent_P(indexHTML_part_52);
  server.sendContent_P(indexHTML_part_53);
  server.sendContent_P(indexHTML_part_54);
  server.sendContent_P(indexHTML_part_55);
  server.sendContent_P(indexHTML_part_56);
  server.sendContent_P(indexHTML_part_57);
  server.sendContent_P(indexHTML_part_58);
  server.sendContent_P(indexHTML_part_59);
  server.sendContent_P(indexHTML_part_60);
  server.sendContent_P(indexHTML_part_61);
  server.sendContent_P(indexHTML_part_62);
  server.sendContent_P(indexHTML_part_63);
  server.sendContent_P(indexHTML_part_64);
  server.sendContent_P(indexHTML_part_65);
  server.sendContent_P(indexHTML_part_66);
  server.sendContent_P(indexHTML_part_67);
  server.sendContent_P(indexHTML_part_68);
  server.sendContent_P(indexHTML_part_69);
  server.sendContent_P(indexHTML_part_70);
  server.sendContent_P(indexHTML_part_71);
  server.sendContent_P(indexHTML_part_72);
  server.sendContent_P(indexHTML_part_73);
  server.sendContent_P(indexHTML_part_74);
  server.sendContent_P(indexHTML_part_75);
  server.sendContent_P(indexHTML_part_76);
  server.sendContent_P(indexHTML_part_77);
  server.sendContent_P(indexHTML_part_78);
  server.sendContent_P(indexHTML_part_79);
  server.sendContent_P(indexHTML_part_80);
  server.sendContent_P(indexHTML_part_81);
  server.sendContent_P(indexHTML_part_82);
  server.sendContent_P(indexHTML_part_83);
  server.sendContent_P(indexHTML_part_84);
  server.sendContent_P(indexHTML_part_85);
  server.sendContent_P(indexHTML_part_86);
  server.sendContent_P(indexHTML_part_87);
  server.sendContent_P(indexHTML_part_88);
  server.sendContent_P(indexHTML_part_89);
  server.sendContent_P(indexHTML_part_90);
  server.sendContent_P(indexHTML_part_91);
  server.sendContent_P(indexHTML_part_92);
  server.sendContent_P(indexHTML_part_93);
  server.sendContent_P(indexHTML_part_94);
  server.sendContent_P(indexHTML_part_95);
  server.sendContent_P(indexHTML_part_96);
  server.sendContent_P(indexHTML_part_97);
  server.sendContent_P(indexHTML_part_98);
  server.sendContent_P(indexHTML_part_99);
  server.sendContent_P(indexHTML_part_100);
  server.sendContent_P(indexHTML_part_101);
  server.sendContent_P(indexHTML_part_102);
  server.sendContent_P(indexHTML_part_103);
  server.sendContent_P(indexHTML_part_104);
  server.sendContent_P(indexHTML_part_105);
  server.sendContent_P(indexHTML_part_106);
  server.sendContent_P(indexHTML_part_107);
  server.sendContent_P(indexHTML_part_108);
  server.sendContent_P(indexHTML_part_109);
  server.sendContent_P(indexHTML_part_110);
  server.sendContent_P(indexHTML_part_111);
  server.sendContent_P(indexHTML_part_112);
  server.sendContent_P(indexHTML_part_113);
  server.sendContent_P(indexHTML_part_114);
  server.sendContent_P(indexHTML_part_115);
  server.sendContent_P(indexHTML_part_116);
  server.sendContent_P(indexHTML_part_117);
  server.sendContent_P(indexHTML_part_118);
  server.sendContent_P(indexHTML_part_119);
  server.sendContent_P(indexHTML_part_120);
  server.sendContent_P(indexHTML_part_121);
  server.sendContent_P(indexHTML_part_122);
  server.sendContent_P(indexHTML_part_123);
  server.sendContent_P(indexHTML_part_124);
  server.sendContent_P(indexHTML_part_125);
  server.sendContent_P(indexHTML_part_126);
  server.sendContent_P(indexHTML_part_127);
  server.sendContent_P(indexHTML_part_128);
  server.sendContent_P(indexHTML_part_129);
  server.sendContent_P(indexHTML_part_130);
  server.sendContent_P(indexHTML_part_131);
  server.sendContent_P(indexHTML_part_132);
  server.sendContent_P(indexHTML_part_133);
  server.sendContent_P(indexHTML_part_134);
  server.sendContent_P(indexHTML_part_135);
  server.sendContent_P(indexHTML_part_136);
  server.sendContent_P(indexHTML_part_137);
  server.sendContent_P(indexHTML_part_138);
  server.sendContent_P(indexHTML_part_139);
  server.sendContent_P(indexHTML_part_140);
  server.sendContent_P(indexHTML_part_141);
  server.sendContent_P(indexHTML_part_142);
  server.sendContent_P(indexHTML_part_143);
  server.sendContent_P(indexHTML_part_144);
  server.sendContent_P(indexHTML_part_145);
  server.sendContent_P(indexHTML_part_146);
  server.sendContent_P(indexHTML_part_147);
  server.sendContent_P(indexHTML_part_148);
  server.sendContent_P(indexHTML_part_149);
  server.sendContent_P(indexHTML_part_150);
  server.sendContent_P(indexHTML_part_151);
  server.sendContent_P(indexHTML_part_152);
  server.sendContent_P(indexHTML_part_153);
  server.sendContent_P(indexHTML_part_154);
  server.sendContent_P(indexHTML_part_155);
  server.sendContent_P(indexHTML_part_156);
  server.sendContent_P(indexHTML_part_157);
  server.sendContent_P(indexHTML_part_158);
  server.sendContent_P(indexHTML_part_159);
  server.sendContent_P(indexHTML_part_160);
  server.sendContent_P(indexHTML_part_161);
  server.sendContent_P(indexHTML_part_162);
  server.sendContent_P(indexHTML_part_163);
  server.sendContent_P(indexHTML_part_164);
  server.sendContent_P(indexHTML_part_165);
  server.sendContent_P(indexHTML_part_166);
  server.sendContent_P(indexHTML_part_167);
  server.sendContent_P(indexHTML_part_168);
  server.sendContent_P(indexHTML_part_169);
  server.sendContent_P(indexHTML_part_170);
  server.sendContent_P(indexHTML_part_171);
  server.sendContent_P(indexHTML_part_172);
  server.sendContent_P(indexHTML_part_173);
  server.sendContent_P(indexHTML_part_174);
  server.sendContent_P(indexHTML_part_175);
  server.sendContent_P(indexHTML_part_176);
  server.sendContent_P(indexHTML_part_177);
  server.sendContent_P(indexHTML_part_178);
  server.sendContent_P(indexHTML_part_179);
  server.sendContent_P(indexHTML_part_180);
  server.sendContent_P(indexHTML_part_181);
  server.sendContent_P(indexHTML_part_182);
  server.sendContent_P(indexHTML_part_183);
  server.sendContent_P(indexHTML_part_184);
  server.sendContent_P(indexHTML_part_185);
  server.sendContent_P(indexHTML_part_186);
  server.sendContent_P(indexHTML_part_187);
  server.sendContent_P(indexHTML_part_188);
  server.sendContent_P(indexHTML_part_189);
  server.sendContent_P(indexHTML_part_190);
  server.sendContent_P(indexHTML_part_191);
  server.sendContent_P(indexHTML_part_192);
  server.sendContent_P(indexHTML_part_193);
  server.sendContent_P(indexHTML_part_194);
  server.sendContent_P(indexHTML_part_195);
  server.sendContent_P(indexHTML_part_196);
  server.sendContent_P(indexHTML_part_197);
  server.sendContent_P(indexHTML_part_198);
  server.sendContent_P(indexHTML_part_199);
  server.sendContent_P(indexHTML_part_200);
  server.sendContent_P(indexHTML_part_201);
  server.sendContent_P(indexHTML_part_202);
  server.sendContent_P(indexHTML_part_203);
  server.sendContent_P(indexHTML_part_204);
  server.sendContent_P(indexHTML_part_205);
  server.sendContent_P(indexHTML_part_206);
  server.sendContent_P(indexHTML_part_207);
  server.sendContent_P(indexHTML_part_208);
  server.sendContent_P(indexHTML_part_209);
  server.sendContent_P(indexHTML_part_210);
  server.sendContent_P(indexHTML_part_211);
  server.sendContent_P(indexHTML_part_212);
  server.sendContent_P(indexHTML_part_213);
  server.sendContent_P(indexHTML_part_214);
  server.sendContent_P(indexHTML_part_215);
  server.sendContent_P(indexHTML_part_216);
  server.sendContent_P(indexHTML_part_217);
  server.sendContent_P(indexHTML_part_218);
  server.sendContent_P(indexHTML_part_219);
  server.sendContent_P(indexHTML_part_220);
  server.sendContent_P(indexHTML_part_221);
  server.sendContent_P(indexHTML_part_222);
  server.sendContent_P(indexHTML_part_223);
  server.sendContent_P(indexHTML_part_224);
  server.sendContent_P(indexHTML_part_225);
  server.sendContent_P(indexHTML_part_226);
  server.sendContent_P(indexHTML_part_227);
  server.sendContent_P(indexHTML_part_228);
  server.sendContent_P(indexHTML_part_229);
  server.sendContent_P(indexHTML_part_230);
  server.sendContent_P(indexHTML_part_231);
  server.sendContent_P(indexHTML_part_232);
  server.sendContent_P(indexHTML_part_233);
  server.sendContent_P(indexHTML_part_234);
  server.sendContent_P(indexHTML_part_235);
  server.sendContent_P(indexHTML_part_236);
  server.sendContent_P(indexHTML_part_237);
  server.sendContent("");
}

void handleNotFound(){
  server.send(404, "text/plain", "404: Not found"); // Send HTTP status 404 (Not Found) when there's no handler for the URI in the request
}

void webServerLoop(){
    server.handleClient(); 
}
