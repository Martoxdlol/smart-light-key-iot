#include <Regexp.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include "flash.h"
#include "global.h"
#include "command.h"
#include "tcp-server.h"

unsigned long spreadWifiCredentialsMS = 0;

bool spreadWifiCredentialsRequired = 0;

class WifiNetwork {
  public:
    String ssid;
    String password;
    int rssi;
    String code;
    bool isDevice;
    bool matchOk;
    char connectionStatus;
    WifiNetwork(String _ssid, String _password, int _rssi, String _code, bool _isDevice, bool _matchOk, char _connectionStatus);
    WifiNetwork();
    String toString();
    char * ssidCharArray();
};


WifiNetwork::WifiNetwork(String _ssid, String _password, int _rssi, String _code, bool _isDevice, bool _matchOk, char _connectionStatus) {
  this->ssid = _ssid;
  this->password = _password;
  this->rssi = _rssi;
  this->code = _code;
  this->isDevice = _isDevice;
  this->matchOk = _matchOk;
  this->connectionStatus = _connectionStatus;
};


WifiNetwork::WifiNetwork() {
  this->ssid = "";
  this->password = "";
  this->rssi = 0;
  this->code = "";
  this->isDevice = false;
  this->matchOk = false;
  this->connectionStatus = 'x';
};

String WifiNetwork::toString() {
  return String(ssid + ", " + password + ", " + String(rssi) + ", " + code + ", " + String(isDevice) + ", " + String(matchOk) + ", " + String(connectionStatus));
}

char * ssidCharArray() {
  char buf[100];
  ssid.toCharArray(buf,100);
  return buf;
}


bool isWChar(char c) {
  int num = (int)c;
  if (num >= 65 && num <= 90 ||
      num >= 97 && num <= 122 ||
      num >= 48 && num <= 57 ||
      num == 45 || num == 95 || num == 32
     ) return true;
  return false;
}
bool isCChar(char c) {
  int num = (int)c;
  if (num >= 65 && num <= 90 ||
      num >= 97 && num <= 122 ||
      num >= 48 && num <= 57
     ) return true;
  return false;
}



WifiNetwork matchWifiName(String str) {
  char typecode = 'i';
  char statuscode = 'x';

  String code = "";
  int pos = 1; // Wifi nombre |[|d3v1c3C0d3|]|x|.|i
  //              1  2          3 4 5 6 7

  for (int i = 0; i < str.length(); i++) {
    char charr = str[i];
    if (pos == 1 && !isWChar(charr)) {
      if (charr != '[') {
        WifiNetwork net("", "", 0, "", false, false, 'x');
        return net;
      }
      pos = 3;
    } else if (pos == 2) {
      pos = 3;
    } else if (pos == 3 && charr == ']') {
      pos = 5;
    } else if (pos == 3) {
      // console .  log("b")
      if (!isCChar(charr)) {
        WifiNetwork net("", "", 0, "", false, false, 'x');
        return net;
      }
      code += charr;
      if (code.length() > 12) {
        WifiNetwork net("", "", 0, "", false, false, 'x');
        return net;
      }
    } else if (pos == 4) {
      pos = 5;
    } else if (pos == 5) {
      if (charr != 'w' && charr != 'c' && charr != 'x' && charr != 'y' && charr != 'z') {
        WifiNetwork net("", "", 0, "", false, false, 'x');
        return net;
      }
      statuscode = charr;
      pos = 6;
    } else if (pos == 6) {
      if (charr != '.') {
        WifiNetwork net("", "", 0, "", false, false, 'x');
        return net;
      }
      pos = 7;
    } else if (pos == 7) {
      if (charr != 'a' && charr != 'e' && charr != 'i' && charr != 'o' && charr != 'u') {
        WifiNetwork net("", "", 0, "", false, false, 'x');
        return net;
      }
      typecode = charr;
      pos = 8;
    } else if (pos == 8) {
      WifiNetwork net("", "", 0, "", false, false, 'x');
      return net;
    }
  }


  if (pos != 8 || code.length() > 12 || code.length() < 8) {
    WifiNetwork net("", "", 0, "", false, false, 'x');
    return net;
  } else {
    WifiNetwork net(String(str), String(code), -10, String(code), true, true, statuscode);
    return net;
  }
}

String makeid(int len){
  randomSeed(millis());
  char id[len];
  char *letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(int i = 0; i < len; i++){
    byte randomValue = random(0, 61);
    id[i] = letters[randomValue];
  }
  return String(id);
}

String makeid(){
  return makeid(20);
}

void updateOutputs(){
  digitalWrite(5, stateA);
  digitalWrite(4, stateB);
  digitalWrite(16, stateC);
}

void spreadWifiCredentials(){
    const size_t CAPACITY = JSON_OBJECT_SIZE(6);
    StaticJsonDocument<CAPACITY> doc2;

    JsonObject object = doc2.to<JsonObject>();
    object["ssid"] = ssid;
    object["password"] = password;
  
    char bufx[200];
    serializeJson(doc2,bufx);
    String bufxs = String(bufx);
    char bufp[500];
    encodeCommand("NEW_WIFI_CREDENTIALS",bufxs).toCharArray(bufp,bufxs.length());
    
    //Desactivado temporalmente
    //sendToAllClients(bufp);
}

void spreadLoop(){
  if(spreadWifiCredentialsRequired && spreadWifiCredentialsMS + 30000 < millis()){
    Serial.println("Spreading wifi credentials to TCP server clients");
    Serial.println("");
    Serial.println("");

    delay(100);
    spreadWifiCredentialsMS = millis();
    spreadWifiCredentialsRequired = false;
    spreadWifiCredentials();
  }
}

void markSpreadWifiCredentialsRequired(){
  spreadWifiCredentialsRequired = true;
  spreadWifiCredentialsMS = millis();
}