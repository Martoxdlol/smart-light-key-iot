#include <Arduino.h>
#include "ESP8266WiFi.h"
#include "global.h"
#include "flash.h"
#include "util.h"

const WifiNetwork emptyNetwork();

WifiNetwork wifis[30];

void selectionSort(WifiNetwork a[], int n) {
   int i, j, min;
   WifiNetwork temp;
   for (i = 0; i < n - 1; i++) {
      min = i;
      for (j = i + 1; j < n; j++)
      if (a[j].rssi > a[min].rssi)
      min = j;
      temp = a[i];
      a[i] = a[min];
      a[min] = temp;
   }
}

int checkPosibleConnections(){
    int listLen = 0;
    int n = WiFi.scanNetworks();
    
    if (n == 0) {

    } else {
        for (int i = 0; i < n && i < 30; ++i) {
            String scannedSsid = WiFi.SSID(i);
            int scannedRssi = WiFi.RSSI(i);
            //WifiNetwork scannedNetwork(String(WiFi.SSID(i)), "", WiFi.RSSI(i), "", false, true, 'x');
            WifiNetwork net = matchWifiName(scannedSsid);
            net.rssi = scannedRssi;
            if(net.matchOk){
                wifis[listLen] = net;
                wifis[listLen].ssid = scannedSsid;
                wifis[listLen].password = net.code;
                listLen++;
            }else if(ssid == scannedSsid && ssid != ""){
                net.matchOk = true;
                net.password = password;
                wifis[listLen] = net;
                wifis[listLen].ssid = scannedSsid;
                wifis[listLen].password = password;
                listLen++;
            }
        }
    }

    selectionSort(wifis,listLen);

    return listLen;
}

String wifiOptionSSID(int i){
    return wifis[i].ssid;
}

String wifiOptionPASS(int i){
    return wifis[i].password;
}