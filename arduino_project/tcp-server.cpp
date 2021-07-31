#include "ESP8266WiFi.h"
#include "global.h"
#include "tcp-client.h"

IPAddress listenIp(0,0,0,0);
WiFiServer wifiServer(listenIp, 22002);


WiFiClient clients[20]; //20 registered clients max
int i_c[20]; //CHAR POSITION ON LINE
int k_c[20]; //Max reading chars blocking loop()
bool t_c[20]; //TMP val used to test if write a line jump on Serial
char clientLines[20][500]; //Storage of lines of clients


void saveClient(WiFiClient client){
    bool d = false;
    for(int i = 0; i < 20; i++){
        if(clients[i].remotePort() == clients[i].remotePort()){
            clients[i] = client;
            d = true;
            break;
        }
    }
    if(!d){
        for(int i = 0; i < 20; i++){
            if(!clients[i].connected()){
                clients[i] = client;
                break;
            }
        }
    }
}


void processLineC(char line[500]){
    Serial.print("NUEVA LINEA COMPLETA DE UN CLIENTE: (");Serial.print(line);Serial.println(")");
    writeLine(line);
}


bool beg = false;

void tcpServerLoop(){
    if(!beg){
        wifiServer.begin();
        beg = true;
    }
    WiFiClient client = wifiServer.available();
    if (client && client.connected()) {
        Serial.println("Client availiable");
        Serial.println(client.remoteIP());
        Serial.println(client.remotePort());
        Serial.println(client.localPort());
        Serial.println("");
        ///client.write("\nwww\n");
        saveClient(client);
    }
    
    for(int clientLocalID = 0; clientLocalID < 20; clientLocalID++){
        if(clients[clientLocalID].connected()){
            while (clients[clientLocalID].available() && k_c[clientLocalID] < 100 && i_c[clientLocalID] < 499) {
                if(i_c[clientLocalID] == 0){
                    Serial.print("Datos del cliente  (");Serial.print(clients[clientLocalID].remotePort());Serial.print("): ");
                }
                char ch = static_cast<char>(clients[clientLocalID].read());
                if(ch == '\n' || ch == '\t'){
                    i_c[clientLocalID] = 0;
                    char * lineCopy = clientLines[clientLocalID];
                    Serial.println(" Fin de linea"); 
                    Serial.println(clientLines[clientLocalID]);
                    processLineC(lineCopy);
                    clientLines[clientLocalID][0] = 0;
                    clientLines[clientLocalID][1] = 0;
                    clientLines[clientLocalID][2] = 0;
                }else {
                    Serial.print(ch);
                    clientLines[clientLocalID][i_c[clientLocalID]] = ch;
                    clientLines[clientLocalID][i_c[clientLocalID]+1] = 0;
                    i_c[clientLocalID]++;
                    t_c[clientLocalID] = true;
                }
                k_c[clientLocalID]++;
            }
            if(t_c[clientLocalID]){
                Serial.println("");
                t_c[clientLocalID] = false;
            }
            if(i_c[clientLocalID] == 500){
                i_c[clientLocalID] = 0;
            }
            k_c[clientLocalID] = 0;

        }
    }
}

void sendToAllClients(char line[500]){
    for(int j = 0; j< 20; j++){
        if(clients[j].connected()){
            Serial.print("SENDING LINE TO CLIENT: ");Serial.println(line);
            clients[j].write("\n");
            clients[j].write(line);
            /*for(int i = 0; i < 499; i++){
                if(!line[i] != 0){
                    clients[j].write(line[i]);
                }else{
                    break;
                } 
            }*/
            clients[j].write("\n");
        }
    }
}


