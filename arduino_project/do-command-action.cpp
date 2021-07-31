#include <Arduino.h>  
#include "ArduinoJson.h"
#include "global.h"
#include "flash.h"
#include "util.h"
#include "tcp-server.h"
#include "tcp-client.h"
#include "command.h"
#include <ArduinoOTA.h>
#include <ESP8266httpUpdate.h>

long long lastTimestamp = 0;

String getStateJSON(){
    const size_t CAPACITY = JSON_OBJECT_SIZE(6);
    StaticJsonDocument<CAPACITY> doc2;
    JsonObject object = doc2.to<JsonObject>();
    object["a"] = stateA;
    object["b"] = stateB;
    object["c"] = stateC;
    char buf[40];
    serializeJson(doc2,buf);
    return String(buf);
}

String getInfoJSON(){
    const size_t CAPACITY = JSON_OBJECT_SIZE(6);
    StaticJsonDocument<CAPACITY> doc2;
    JsonObject object = doc2.to<JsonObject>();
    object["hardwareVersion"] = hardwareVersion;
    object["softwareVersion"] = softwareVersion;
    object["deviceCode"] = deviceCode;
    object["millis"] = millis();
    object["ssid"] = ssid;
    object["password"] = password;
    char buf[100];
    serializeJson(doc2,buf);
    return String(buf);
}

void sendToServer(Command c){
    char line[500];
    String encoded = c.encode();
    encoded.toCharArray(line,499);
    writeLine(line);
}

/*report state
get state
set state
get auth //replaced by any command response
wifi update
auto action
device info
*/

void doCommandAction(Command c){
    String command = c.command;
    String content = c.content;

    if(command == "GET_STATE"){
        Serial.println("Server requested state");
        Command r = Command("RESPONSE",getStateJSON());
        r.commandID = c.commandID;
        r.isJson = true;
        sendToServer(r);
    }else if(command == "SET_STATE"){
        Serial.println("Received new state");
        DynamicJsonDocument doc(499);
        DeserializationError err = deserializeJson(doc, content);
        const char* a = doc["a"];
        const char* b = doc["b"];
        const char* cc = doc["c"];
        const char* t = doc["timestamp"];

        String as = String(a);
        String bs = String(b);
        String cs = String(cc);

        if(as == "1" || as == "true"){
            stateA = true;
            Serial.print("Updated A to: ");Serial.println(stateA);
            sendUpdateRequired = true;
        }else if(as == "0" || as == "false"){
            stateA = false;
            Serial.print("Updated A to: ");Serial.println(stateA);
            sendUpdateRequired = true;
        }
        if(bs == "1" || bs == "true"){
            stateB = true;
            Serial.print("Updated B to: ");Serial.println(stateB);
            sendUpdateRequired = true;
        }else if(bs == "0" || bs == "false"){
            stateB = false;
            Serial.print("Updated B to: ");Serial.println(stateB);
            sendUpdateRequired = true;
        }
        if(cs == "1" || cs == "true"){
            stateC = true;
            Serial.print("Updated C to: ");Serial.println(stateC);
            sendUpdateRequired = true;
        }else if(cs == "0" || cs == "false"){
            stateC = false;
            Serial.print("Updated C to: ");Serial.println(stateC);
            sendUpdateRequired = true;
        }

        updateOutputs();

        Command r = Command("RESPONSE","{\"status\":\"ok\"}");
        r.commandID = c.commandID;
        sendToServer(r);

    }else if(command == "GENERIC"){
        Command r = Command("RESPONSE","{\"status\":\"nothing\"}");
        r.commandID = c.commandID;
        r.isJson = true;
        sendToServer(r);
    }else if(command == "GET_INFO"){
        Serial.println("Server requested state");
        Command r = Command("RESPONSE",getInfoJSON());
        r.commandID = c.commandID;
        r.isJson = true;
        sendToServer(r);
    }else if(command == "NEW_WIFI_CREDENTIALS"){

        Serial.println("Received new wifi credentials");
        DynamicJsonDocument doc(499);
        DeserializationError err = deserializeJson(doc, content);
        const char* newSsid = doc["ssid"];
        const char* newPass = doc["pass"];

        String newSsidString = String(newPass);
        String newPassString = String(newPass);


        if(newSsidString.length() >= 1 && newSsidString.length() <= 32 && newPassString.length() <= 64){
            ssid = newSsidString;
            password = newPassString;
            saveToFlash();
        }

        //Response not required
        //Command r = Command("RESPONSE","{\"status\":\"nothing\"");
        //r.commandID = c.commandID;
        //sendToServer(r);
    }else if(command == "UPDATE_FIRMWARE"){
        Serial.print("Server requested to update firmware: ");
        Serial.println(c.content);
        Command r = Command("RESPONSE","{\"error\":false,\"status\":\"ok\"}");
        r.commandID = c.commandID;
        r.isJson = true;
        sendToServer(r);

        //http://localhost:9005/send_command?code=2ajeYep7&command=UPDATE_FIRMWARE&content={%22port%22:%229004%22,%22address%22:%22devices.iot.abcd.ar%22,%22path%22:%22/soft1.4.bin%22}

        DynamicJsonDocument doc(499);
        DeserializationError err = deserializeJson(doc, content);
        const char* addr = doc["address"];
        const char* port = doc["port"];
        const char* path = doc["path"];

        String addrstr = String(addr);
        String pathstr = String(path);
        int portint = String(port).toInt();

        Serial.println("UPDATE ADDR");
        Serial.println(addrstr);
        Serial.println("UPDATE PORT");
        Serial.println(portint);

        String u2 = String("/updater?path=")+pathstr+String("&port=")+String(portint)+String("&host=")+addrstr;
        Serial.println(u2);

        bool f = false;

        t_httpUpdate_return ret = ESPhttpUpdate.update(addrstr, portint, pathstr, deviceCode);
        switch(ret) {
            case HTTP_UPDATE_FAILED:
                Serial.println("[update] Update failed.");
                break;
            case HTTP_UPDATE_NO_UPDATES:
                Serial.println("[update] Update no Update.");
                break;
            case HTTP_UPDATE_OK:
                f = true;
                Serial.println("[update] Update ok."); // may not be called since we reboot the ESP
                break;
        }
        if(f){
            Serial.print("TRY 2");
            
            t_httpUpdate_return ret2 = ESPhttpUpdate.update("192.168.4.1", 80, u2, deviceCode);
            switch(ret2) {
                case HTTP_UPDATE_FAILED:
                    Serial.println("[update] Update (try 2) failed.");
                    break;
                case HTTP_UPDATE_NO_UPDATES:
                    Serial.println("[update] Update (try 2) no Update.");
                    break;
                case HTTP_UPDATE_OK:
                    Serial.println("[update] Update (try 2) ok."); // may not be called since we reboot the ESP
                    break;
            }
        }

    }else{
        Serial.print("Unknown command: ");Serial.println(c.command);
        
        Command r = Command("RESPONSE","{\"error\":true,\"error_code\":\"UNKNOWN_COMMAND\"}");
        r.commandID = c.commandID;
        sendToServer(r);
    }
}

void reportState(){
    Command r = Command("REPORT_STATE",getStateJSON());
    r.isJson = true;
    sendToServer(r);
}


void startUpdateA(){
    
}