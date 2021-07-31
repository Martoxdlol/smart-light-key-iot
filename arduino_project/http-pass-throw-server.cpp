// #include "ESP8266WiFi.h"

// typedef struct
//  {
//     int port;
//     WiFiClient self;
//     WiFiClient conn;
//  } ClientRef;

// ClientRef upClients[5];



// IPAddress listenIp2(0,0,0,0);
// WiFiServer wifiServer(listenIp2, 9004);

// void tcpServerLoop(){
//     WiFiClient client = wifiServer.available();
//     for(int i = 0; i < 5; i++){
//         if(upClients[i].port == client.remotePort()){
//             upClients[i].self = client;
//             break;
//         }else if(!isActive(upClients[i])){
//             upClients[i].self = client;
//             upClients[i].port = client.remotePort();
//         }
//     }
//     while (client.available())
//     {
//         client.read();
//     }
    
// }


// bool isActive(ClientRef test){
//     if(test.conn.connected() == false && test.self.connected() == false) return false
//     return true
// }