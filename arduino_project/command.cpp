#include <Arduino.h>
#include <ArduinoJson.h>
#include "global.h"
#include "flash.h"
#include "util.h"
#include <Hash.h>

class Command{
    public:
        String content;
        String to;
        String from;
        String hash;
        String command;
        String commandID;
        bool isJson;
        Command(String command, String content);
        Command(String _command, String _content, String _to, String _from, String _hash);
        Command(String _command, String _content, String _to, String _from, String _hash, String id);
        bool verify();
        String encode();
};

String encodeCommand(String command,String content, String id, bool isJson){
    char buf[500];
    const size_t CAPACITY = JSON_OBJECT_SIZE(20);
    StaticJsonDocument<CAPACITY> doc;
    JsonObject object = doc.to<JsonObject>();
    object["to"] = "_server";
    object["from"] = deviceCode;
    object["content"] = content;
    object["command"] = command;
    object["commandID"] = id;
    object["isContentJSON"] = isJson;
    object["hash"] = sha1(String(content+deviceKey));
    serializeJson(doc,buf);
    return String(buf);
}

String encodeCommand(String command,String content, String id){
    encodeCommand(command,content,id,false);
}

String encodeCommand(String command,String content){
    String id = makeid();
    encodeCommand(command,content,id);
}

String encodeCommand(String command,String content,bool isJson){
    String id = makeid();
    encodeCommand(command,content,id,isJson);
}

Command::Command(String _command, String _content){
    this->command = _command;
    this->content = _content;
    this->to = "_server";
    this->from = deviceCode;
    this->hash = sha1(String(_content+deviceKey));
}

Command::Command(String _command, String _content, String _to, String _from, String _hash, String id){
    this->command = _command;
    this->content = _content;
    this->to = _to;
    this->from = _from;
    this->hash = _hash;
    this->commandID = id;
}

Command::Command(String _command, String _content, String _to, String _from, String _hash){
    this->command = _command;
    this->content = _content;
    this->to = _to;
    this->from = _from;
    this->hash = _hash;
    this->commandID = makeid();
}


Command decodeCommand(String str){
    //char * json;
    //str.toCharArray(json,499);
    DynamicJsonDocument doc(499);
    DeserializationError err = deserializeJson(doc, str);
    const char* content = doc["content"];
    const char* command = doc["command"];
    const char* to = doc["to"];
    const char* from = doc["from"];
    const char* hash = doc["hash"];
    const char* id = doc["commandID"];
    const char* isj = doc["isContentJSON"];
    bool isJson = false;
    if(String(isj) == "true") isJson = true;
    Command c = Command(command,content,to,from,hash,id);
    c.isJson = isJson;
    return c;
}

bool Command::verify(){
    return (String(sha1(String(this->content+deviceKey))) == String(this->hash));
}

String Command::encode(){
    return encodeCommand(this->command,this->content,this->commandID,this->isJson);
}


/*
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
*/