#include <Arduino.h>
#include "flash.h"
#include "global.h"

char lineii[200];
int iii;

void printInfo(){
    Serial.print("deviceCode: (");Serial.print(deviceCode);Serial.println(")");
    Serial.print("deviceKey: (");Serial.print(deviceKey);Serial.println(")");
    Serial.print("ssid: (");Serial.print(ssid);Serial.println(")");
    Serial.print("password: (");Serial.print(password);Serial.println(")");
    Serial.print("saved host: (");Serial.print(savedHost);Serial.println(")");
    Serial.print("saved port: (");Serial.print(savedPort);Serial.println(")");
    Serial.print("debug mode: (");Serial.print(debugMode);Serial.println(")");
    Serial.print("firstConfigOk: (");Serial.print(firstConfigOk);Serial.println(")");
}

void processLine(){
    String l = String(lineii);
    if(l.substring(0, 5) == "CODE="){
        deviceCode = l.substring(5, l.length());
        Serial.print("Nuevo code: (");Serial.print(deviceCode);Serial.println(")");
        lineii[0] = 0;
        iii = 0;
    }else if(l.substring(0, 4) == "KEY="){
        deviceKey = l.substring(4, l.length());
        Serial.print("Nueva key: (");Serial.print(deviceKey);Serial.println(")");
        lineii[0] = 0;
        iii = 0;
    }else if(l.substring(0, 5) == "SSID="){
        ssid = l.substring(5, l.length());
        Serial.print("Nuevo ssid: (");Serial.print(ssid);Serial.println(")");
        lineii[0] = 0;
        iii = 0;
    }else if(l.substring(0, 5) == "PASS="){
        password = l.substring(5, l.length());
        Serial.print("Nueva contraseña: (");Serial.print(password);Serial.println(")");
        lineii[0] = 0;
        iii = 0;
    }else if(l.substring(0, 9) == "PASSWORD="){
        password = l.substring(9, l.length());
        Serial.print("Nueva contraseña: (");Serial.print(password);Serial.println(")");
        lineii[0] = 0;
        iii = 0;
    }if(l.substring(0, 6) == "DEBUG="){
        debugMode = l.substring(6, l.length()) == "true";
        if(l.substring(6, l.length()) == "True") debugMode = true;
        if(l.substring(6, l.length()) == "TRUE") debugMode = true;
        Serial.print("Modo debug: (");Serial.print(debugMode);Serial.println(")");
        lineii[0] = 0;
        iii = 0;
    }if(l.substring(0, 5) == "PORT="){
        savedPort = l.substring(5, l.length());
        Serial.print("Nuevo puerto: (");Serial.print(savedPort);Serial.println(")");
        lineii[0] = 0;
        iii = 0;
    }if(l.substring(0, 5) == "HOST="){
        savedHost = l.substring(5, l.length());
        Serial.print("Nuevo host: (");Serial.print(savedHost);Serial.println(")");
        lineii[0] = 0;
        iii = 0;
    }else if(l == "SAVE"){
        lineii[0] = 0;
        iii = 0;

        Serial.println("GUARDANDO:");
        printInfo();
        saveToFlash();

        loadFromFlash();
        printInfo();
    }else if(l == "GET INFO"){
        printInfo();
    }else if(l == "RESTART"){
        ESP.restart();
    }
    iii = 0;
}

void serialLoop(){
    //if(firstConfigOk) return;

    while (Serial.available()) {
        delay(3);
        if (Serial.available() > 0) {
            char c = Serial.read();
            if(c == '\n' || c == '&'){
                lineii[iii] = 0;
                processLine();
                iii = 0;
            }else{
                lineii[iii] = c;
                iii++;
            }
            if(iii == 198) iii = 0;
        }
    }
}