#include <Regexp.h>
#include <ArduinoJson.h>
#include "util.h"
#include "flash.h"
#include "global.h"
#include "ESP8266WiFi.h"
#include <EEPROM.h> 
#include <ESP8266mDNS.h>
#include "web-server.h"
#include "tcp-server.h"
#include "tcp-client.h"
#include "key-press-handler.h"
#include "command.h"
#include "serial.h"
#include "wifi.h"
#include "do-command-action.h"
#include <ArduinoOTA.h>

bool serverConnectedTMP = serverConnected;
bool flashRequireSave;
unsigned long flashRequireSaveMS;


void setAp(){
  WiFi.softAPdisconnect (true);
  String connStatus = serverConnected ? "c" : "x";
  bool result = WiFi.softAP(String("Key Touch ["+deviceCode+"]"+connStatus+".i"), deviceCode);
  if(result)
  {
    Serial.println("AP STARTED");
  }
  else
  {
    delay(150);
    bool result = WiFi.softAP(String("Key Touch ["+deviceCode+"]"+connStatus+".i"), deviceCode);
  }
}


void setup() {
  // put your setup code here, to run once:

  EEPROM.begin(611);
  delay(10);
  loadFromFlash();
  delay(40);
  initKeys();
  delay(40);

  Serial.begin(115200);
  /*
  //TEST COMMAND CLASS
  deviceCode = "2ajeYep7";
  deviceKey = "a01aNcamlAlUfTU81knXCJqxqiFuDol5";

  Command c = Command("REPORT_STATE","{a:0,b:0,c:1}");
  Serial.println(c.encode());
  Serial.println(c.verify());
  c = decodeCommand("{\"command\":\"REPORT_STATE\",\"from\":\"asdas22424\",\"to\":\"_server\",\"content\":\"{\\\"a\\\":1,\\\"b\\\":0,\\\"c\\\":0}\",\"hash\":\"122bcd8316156db9f59729698492c98a20e27c5c\"}");
  Serial.println(c.encode());
  Serial.println(c.verify());
  c = decodeCommand("{\"command\":\"REPORT_STATE\",\"from\":\"asdas22424\",\"to\":\"_server\",\"content\":\"{\\\"a\\\":1,\\\"b\\\":0,\\\"c\\\":0}\",\"hash\":\"122bcd8316156db9f59729698492c920e27c5c\"}");
  Serial.println(c.encode());
  Serial.println(c.verify());
  c = decodeCommand("{command\":\"REPORT_STATE\",\"from\":\"asdas22424\",\"to\":\"_server\",\"content\":\"{\\\"a\\\":1,\\\"b\\\":0,\\\"c\\\":0}\",\"hash\":\"122bcd8316156db9f59729698492c920e27c5c\"}");
  Serial.println(c.encode());
  Serial.println(c.verify());*/

  WiFi.hostname(String("Key touch "+deviceCode));
  
  if ( !firstConfigOk ) {
    for (int i = 0; i < 404; i++) {
      EEPROM.write(i, 0);
    }
    EEPROM.commit();
    delay(500);
    loadFromFlash();
  }

 
  Serial.print("deviceCode: (");Serial.print(deviceCode);Serial.println(")");
  Serial.print("deviceKey: (");Serial.print(deviceKey);Serial.println(")");
  Serial.print("ssid: (");Serial.print(ssid);Serial.println(")");
  Serial.print("password: (");Serial.print(password);Serial.println(")");
  Serial.print("firstConfigOk: (");Serial.print(firstConfigOk);Serial.println(")");


  /*
  deviceCode = "2ajeYep7";
  deviceKey = "a01aNcamlAlUfTU81knXCJqxqiFuDol5";
  ssid = "Wificichero";
  password = "7272727272";
  saveToFlash();

  loadFromFlash();
  Serial.print("deviceCode: (");Serial.print(deviceCode);Serial.println(")");
  Serial.print("deviceKey: (");Serial.print(deviceKey);Serial.println(")");
  Serial.print("ssid: (");Serial.print(ssid);Serial.println(")");
  Serial.print("password: (");Serial.print(password);Serial.println(")");
  Serial.print("firstConfigOk: (");Serial.print(firstConfigOk);Serial.println(")");

  deviceCode = "2ajeYep7";
  deviceKey = "a01aNcamlAlUfTU81knXCJqxqiFuDol5";
  ssid = "Wificichero";
  password = "7272727272";*/

  setAp();
  MDNS.begin("keytouch");
  webServerBegin();
  //clientSetup();
}

void loop() {
  if(millis() > 4294267295){
    ESP.restart();
  }
  spreadLoop();
  delayMicroseconds(750);
  wifiLoop();
  webServerLoop();
  tcpClientLoop();
  serialLoop();
  if(serverConnected != serverConnectedTMP){
    serverConnectedTMP = serverConnected;
    Serial.print("Server connection status changed: ");Serial.println(serverConnected);
    setAp();
    delay(50);
  }
  if(sendUpdateRequired){
    //SEND UPDATE
    reportState();
    sendUpdateRequired = false;
    flashRequireSave = true;
    flashRequireSaveMS = millis();
  }
  if(flashRequireSave && flashRequireSaveMS+10000 < millis()){
    flashRequireSave = false;
    flashRequireSaveMS = millis();
    saveToFlash();
    Serial.println("STATE SAVED TO FLASH");
  }
  ArduinoOTA.handle();
  //voidCheckIfMultiLongPress();
}


/*
void wifiLoop() {
  if(wifiLoopMs+2000 > millis()){
    return;
  }
  wifiLoopMs = millis();

  wifiConnected = WiFi.status() == WL_CONNECTED;

  Serial.print("Wifi conectado: ");
  if (wifiConnected) {
    Serial.print("SI: (");
    Serial.print(WiFi.SSID());
    Serial.println(")");
  } else {
    Serial.println("NO");
  }

  if (wifiConnected) {

  } else if(!wifiConnecting()){
    WifiNetwork net = checkPosibleConnection(networkTryOffset);
    if (net.matchOk && net.ssid != "") {
      Serial.print("Se encontró un wifi viable: ");
      Serial.println(net.ssid);
      WiFi.disconnect();
      delay(2);
      wifiConnectingMs = millis();
      WiFi.begin(net.ssid, net.password);
      networkTryOffset++;
    } else {
      Serial.println("No se encontraron wifis viables");
      networkTryOffset = 0;
    }
  }
}
*/