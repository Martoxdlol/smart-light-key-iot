#include <ESP8266WebServer.h>  
#include <Arduino.h>  
#include "ArduinoJson.h"
#include "ESP8266WiFi.h"
#include "global.h"
#include "flash.h"
#include "util.h"
#include "tcp-server.h"
#include "command.h"
#include "do-command-action.h"

WiFiClient client1;
WiFiClient client2;

char* host = "devices.iot.abcd.ar";
int port = 22002;

long long clientConnectingMs1 = -15000;
long long clientConnectingMs2 = -15000;
unsigned long timeoutDataMS = 0;
long long debugMs = -15000;
unsigned long reportMs = 0;
bool connected = false;
bool connected1 = false;
bool connected2 = false;

String getHost(){
    if(debugMode && String(savedHost).length() > 5 && String(savedHost).length() < 98){
        return savedHost;
    }
    return String(host);
}

int getPort(){
    int p = savedPort.toInt();
    if(debugMode && p > 10 && p < 51000){
        return p;
    }
    return port;
}

void connectServer1(){
    if(client1.connected()) return;
    if(debugMode){
        Serial.print(String("[")+getHost()+String(", ")+String(getPort())+String("] "));        
    }
    Serial.println("Conectando client 1...");
    clientConnectingMs1 = millis();
    connected1 = client1.connect(getHost(), getPort());
    Serial.print("Conectado client 1: ");
    Serial.println(connected1 ? "Si" : "NO");
    if(connected1){
        reportState();
        connected = true;
    }
}

void connectServer2(){
    if(client2.connected()) return;
    Serial.println("Conectando client 2...");
    clientConnectingMs2 = millis();
    connected2 = client2.connect("192.168.4.1", port);
    Serial.print("Conectado client 2: ");
    Serial.println(connected2 ? "Si" : "NO");
    if(connected2){
        reportState();
        connected = true;
    }
}




void processLine(char line[500]){
    timeoutDataMS = millis();
    Serial.print("Procesar nueva linea (");
    Serial.print(line);Serial.print(") ");
    if(line[0] != 0 && line[0] != '\n'){
        //
        //Serial.println("OK");

        Command c = decodeCommand(String(line));
        //Verify command to this device
        if(c.to == deviceCode && c.verify() && (c.command != "" || c.content != "")){
            Serial.print("Command verified: ");Serial.println(c.command);
            doCommandAction(c);
        }else{  
            //Command to other device
            Serial.print("Command not verified: ");Serial.println(c.command);
            sendToAllClients(line);

            if(c.command == "NEW_WIFI_CREDENTIALS"){
                //Verification not required
                doCommandAction(c);
            }
        }
        
    }else{
        //Serial.println("ERR (Ignoring empty string)");
    }
}


// i = CHAR POSITION ON LINE
// k = Max reading chars blocking loop()
// t = TMP val used to test if write a line jump on Serial
// line = Storage of line of client

char line[500];
int i = 0;
int k = 0;
bool t = false;
char line2[500];
int i2 = 0;
int k2 = 0;
bool t2 = false;

void tcpClientLoop(){
    connected1 = client1.connected();
    connected2 = client2.connected();
    connected = connected1 || connected2;

    if(timeoutDataMS+50000 < millis()){
        client1.stop();
        client2.stop();
        connected = false;
        connected2 = false;
        connected1 = false;
        Serial.println("HARD RESETTING TCP CLIENT CONNECTION");
        timeoutDataMS = millis();
    }

    if (!client1 || !client1.connected() || client1.status() == CLOSED) connected1 = false;
    if (!client2 || !client2.connected() || client2.status() == CLOSED) connected1 = false;

    if(connected){
        serverConnected = true;
    }else{
        serverConnected = false;
    }
    if(!connected && !connected2 && clientConnectingMs1 + 15000 < millis()){
        clientConnectingMs1 = millis();
        connectServer1();
    }
    if(client1.connected()) connected1 = true;
    if(!connected && !connected1 && !connected2 && clientConnectingMs2 + 15000 < millis()){
        clientConnectingMs2 = millis();
        connectServer2();
    }
    if(client2.connected()) connected2 = true;
    
    if(debugMs + 5000 < millis()){
        debugMs = millis();
        Serial.print("Conectado client 1: ");
        Serial.println(connected1 ? "Si" : "NO");
        Serial.print("Conectado client 2: ");
        Serial.println(connected2 ? "Si" : "NO");
    }


    //client1.keepAlive(25000);
    while (client1.available() && k < 100 && i < 499) {
        timeoutDataMS = millis();
        if(i == 0){
            //Serial.print("Datos del servidor: ");
        }
        char ch = static_cast<char>(client1.read());
        if(ch == '\n' || ch == '\t'){
            i = 0;
            char * lineCopy = line;
            //Serial.println(" Fin de linea");
            processLine(lineCopy);
            line[0] = 0;
            line[1] = 0;
            line[2] = 0;
        }else {
            //Serial.print(ch);
            line[i] = ch;
            line[i+1] = 0;
            i++;
            t = true;
        }
        k++;
    }
    if(t){
        Serial.println("");
        t = false;
    }
    if(i == 500){
        i = 0;
    }
    k = 0;

    while (client2.available() && k2 < 100 && i2 < 499) {
        timeoutDataMS = millis();
        if(i2 = 0){
            //Serial.print("Datos del servidor: ");
        }
        char ch = static_cast<char>(client2.read());
        if(ch == '\n' || ch == '\t'){
            i2 == 0;
            char * lineCopy2 = line2;
            //Serial.println("Fin de linea");
            processLine(lineCopy2);
            line2[0] = 0;
            line2[1] = 0;
            line2[2] = 0;
        }else {
            //Serial.print(ch);
            line2[i2] = ch;
            line2[i2+1] = 0;
            i2++;
            t2 = true;
        }
        k2++;
    }
    if(t2){
        Serial.println("");
        t2 = false;
    }
    if(i2 == 500){
        i2 = 0;
    }
    k2 = 0;



    if(reportMs + 15000 < millis()){
        Serial.println("Sending periodic state update");
        reportState();
        reportMs = millis();
    }
}

void writeLine(char line[500]){
    if(client1.connected()){
        client1.write("\n");
        /*for(int i = 0; i < 499; i++){
            if(line[i] != 0){
                client1.write(line[i]);
            }else{
                break;
            }
        }*/
        client1.write(line);
        client1.write("\n");
    }else if(client2.connected()){
        client2.write("\n");
        /*for(int i = 0; i < 499; i++){
            if(line[i] != 0){
                client2.write(line[i]);
            }else{
                break;
            }
        }*/
        client2.write(line);
        client2.write("\n");
    }else{
        connected1 = false;
        connected2 = false;
        connected = false;
    }
}