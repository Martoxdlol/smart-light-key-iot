#include <Arduino.h>
#include "check-posible-connections.h"
#include "ESP8266WiFi.h"
#include "global.h"
#include "lwp-setup.h"

bool lwipSetuped = false;

unsigned long wifiConnectingMs = -25000;

unsigned long wifiLoopMs = -2000;

bool wifiConnecting(){
    return (wifiConnectingMs+25000) > millis();
}

unsigned long printWifiStatusMS = -5000;

void printWifiStatusLoop(){
    if(printWifiStatusMS + 5000 > millis()) return;
    printWifiStatusMS = millis();
    wifiConnected = WiFi.status() == WL_CONNECTED;
    Serial.print("Wifi conectado: ");
    if (wifiConnected) {
        if(!lwipSetuped){
            Serial.println("STARTED LWIP NAT COSAS RARAS");
            lwipSetup();
        }
        lwipSetuped = true;
        Serial.print("SI: (");
        Serial.print(WiFi.SSID());
        Serial.println(")");
    } else {
     Serial.println("NO");
    }
}

int wifiOptionsI = 0;
int wifiOptionsLen = 0;

void wifiLoop(){
    //Actualizar el estado de la conexion
    wifiConnected = WiFi.status() == WL_CONNECTED;

    //Tiene su propio contador de ms para no sobrecargar la consola
    printWifiStatusLoop();

    //Eviar que el loop() principal se trabe con el loop del wifi todo el tiempo
    if(wifiLoopMs+2000 > millis()){
        return;
    }

    //Si no se esta conectando a ningún wifi y no está conectado a ningun wifi
    if(!wifiConnecting() && !wifiConnected){
        //Si se acabaron las opciones o todavia no hay ninguna
        if(wifiOptionsI == wifiOptionsLen){
            //Cargar las posibles opciones y obtener el largo de la lista
            wifiOptionsLen = checkPosibleConnections();
            //Mostrar la info por serial
            if(wifiOptionsLen == 0){
                Serial.println("No se encontraron wifis viables");
            }else{
                Serial.print("Se encontraron ");Serial.print(wifiOptionsLen);Serial.println(" wifis viables");

                //Mostrar opciones para debug
                // for(int i = 0; i < wifiOptionsLen; i++){
                //     Serial.print("OPCION WIFI: ssid: ");Serial.print(wifiOptionSSID(i));Serial.print(", password: ");Serial.println(wifiOptionPASS(i));
                // }
            }

            //Empezar a contar
            wifiOptionsI = 0;
        }else{
            //Una vez que hay opciones para conectarse

            //Poner el delay para esperar la conexión
            wifiConnectingMs = millis();
            //Desconectar (en realidad es al pedo pero por las dudas)
            WiFi.disconnect();
            delay(50);

            Serial.print("Intentando conectar a (");Serial.print(wifiOptionSSID(wifiOptionsI));Serial.print(", ");Serial.print(wifiOptionPASS(wifiOptionsI));Serial.print("). Es la opción: ");Serial.println(wifiOptionsI);

            //Conectar a la opcion de wifi actual
            WiFi.begin(wifiOptionSSID(wifiOptionsI),wifiOptionPASS(wifiOptionsI));

            //Si cuando pasen los 25 segundos el wifi sigue desconectado se utilizara la proxima opción encontrada
            wifiOptionsI++;
        }
    }else
    if(wifiConnected && (wifiOptionsLen != 0 || wifiOptionsI != 0)){
        //Resetear los valores estos para cuando haga falta
        wifiOptionsI = 0;
        wifiOptionsLen = 0;

        //Este bloque solo se ejecuta despues de conectarse a un wifi
        Serial.print("Se conectó correctamente a: (");
        Serial.print(WiFi.SSID());
        Serial.println(")");
    }
}



// if(wifiLoopMs+2000 > millis()){
//     return;
//   }
//   wifiLoopMs = millis();

//   wifiConnected = WiFi.status() == WL_CONNECTED;

//   Serial.print("Wifi conectado: ");
//   if (wifiConnected) {
//     Serial.print("SI: (");
//     Serial.print(WiFi.SSID());
//     Serial.println(")");
//   } else {
//     Serial.println("NO");
//   }

//   if (wifiConnected) {

//   } else if(!wifiConnecting()){
//     WifiNetwork net = checkPosibleConnection(networkTryOffset);
//     if (net.matchOk && net.ssid != "") {
//       Serial.print("Se encontró un wifi viable: ");
//       Serial.println(net.ssid);
//       WiFi.disconnect();
//       delay(2);
//       wifiConnectingMs = millis();
//       WiFi.begin(net.ssid, net.password);
//       networkTryOffset++;
//     } else {
//       Serial.println("No se encontraron wifis viables");
//       networkTryOffset = 0;
//     }
//   }