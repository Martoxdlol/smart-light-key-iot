// #include <ESP8266WiFi.h>

// #include "lwip/lwip_napt.h"

// #include "lwip/app/dhcpserver.h"


void lwipSetup()
{
//   Serial.begin(115200);
//   Serial.println();

//   WiFi.mode(WIFI_AP_STA);

//   Serial.println("Starting NAT demo");
  
//   //WiFi.config(ip, gateway, subnet);

//   //Wifi connection


// //   Serial.println("");
// //   Serial.print("Connected to ");
// //   Serial.println(sta_ssid);
// //   Serial.print("IP address: ");
// //   Serial.println(WiFi.localIP());
// //   Serial.print("dnsIP address: ");
// //   Serial.println(WiFi.dnsIP());
// //   Serial.print("gatewayIP address: ");
// //   Serial.println(WiFi.gatewayIP());
// //   Serial.print("subnetMask address: ");
// //   Serial.println(WiFi.subnetMask());


// //   Serial.println("");
// //   Serial.println("Configuring access point...");

// //   IPAddress myIP = WiFi.softAPIP();
// //   Serial.print("AP IP address: ");
// //   Serial.println(myIP);

//   // Initialize the NAT feature
//   ip_napt_init(IP_NAPT_MAX, IP_PORTMAP_MAX);

//   // Enable NAT on the AP interface
//   ip_napt_enable_no(1, 1);

//   // Set the DNS server for clients of the AP to the one we also use for the STA interface
//   dhcps_set_DNS(WiFi.dnsIP());
}