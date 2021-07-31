// #include <Arduino.h>
// #include "util.h"
// #include "global.h"
// #include "flash.h"
// #include "ESP8266WiFi.h"


// WifiNetwork result[30];

// int scanWifi() {
//   // WiFi.scanNetworks will return the number of networks found

//   int n = WiFi.scanNetworks();
//   if (n == 0) {

//   } else {
//     for (int i = 0; i < n && i < 30; ++i) {
//       // Print SSID and RSSI for each network found
//       WifiNetwork net(String(WiFi.SSID(i)), "", WiFi.RSSI(i), "", false, true, 'x');
//       result[n] = net;

//       //Serial.print("RESULT: ");Serial.print(result[i].ssid);Serial.print(" - ");Serial.println(result[i].rssi);
//     }
//   }

//   return n;
// }

// void selectionSort(WifiNetwork a[], int n) {
//    int i, j, min;
//    WifiNetwork temp;
//    for (i = 0; i < n - 1; i++) {
//       min = i;
//       for (j = i + 1; j < n; j++)
//       if (a[j].rssi > a[min].rssi)
//       min = j;
//       temp = a[i];
//       a[i] = a[min];
//       a[min] = temp;
//    }
// }

// WifiNetwork * checkPosibleConnection(int offset) {
//   WifiNetwork wifis[30];
//   int j = 0;
//   int n = scanWifi();
//   for (int i = 0; i < n && i < 30; i++) {
//     WifiNetwork net = matchWifiName(result[n].ssid);
//     //Serial.print(String(net.matchOk));Serial.print(" - Wifi matcheado: ");Serial.println(net.toString());
//     net.rssi = result[n].rssi;
//     if (net.matchOk) {
//       net.isDevice = true;
//       wifis[j] = net;
//       j++;
//     } else if (ssid == result[n].ssid && ssid != "") {
//       result[n].password = password;
//       result[n].matchOk = true;
//       wifis[j] = result[n];
//       j++;
//     }
//   }

//   int k;

//   //Serial.println("************");
//   //for (k = 0; k < n && k < 4; k++) {
//   //  Serial.print(wifis[k].ssid);Serial.print(" - ");Serial.println(wifis[k].rssi);
//   //}
//   //Serial.println("************");
  
//   //SORT ARRAY
//   selectionSort(wifis, n);
  
//   //for (k = 0; k < n && k < 4; k++) {
//   //  Serial.print(wifis[k].ssid);Serial.print(" - ");Serial.println(wifis[k].rssi);
//   //}
//   //Serial.println("************");

//   return wifis;
// }


