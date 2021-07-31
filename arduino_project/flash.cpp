#include <Arduino.h>
#include <EEPROM.h>
#include "global.h"

String deviceCode;
String deviceKey;
String ssid;
String password;
String savedPort;
String savedHost;
bool firstConfigOk;

/*
char readBuffer[100];

String readAddressRange(int initial, int len) {
  for (int i = 0; i < len; ++i)
  {
    readBuffer[i] = EEPROM.read(initial + i);
  }
  for (int j = len; j < 100; j++) {
    readBuffer[j] = 0;
  }
  return String(readBuffer);
}

String readAddressRange(int initial) {
  return readAddressRange(initial, 100);
}

void writeAddressRange(String str, int initial) {
  int len = str.length();
  int i;
  for (i = 0; i < len && i < 100; i++)
  {
    EEPROM.write(initial+i, (char)str[i]);
  }
  for (i = len; i < 100; i++)
  {
    EEPROM.write(initial+i, 0);
  }
}*/


void writeToEeprom(String str, int initaddr){
  int len = str.length() < 100 ? str.length() : 99;
  for(int i = 0; i < len; i++){
    EEPROM.write(initaddr+i,(char) str[i]);
  }
  EEPROM.write(initaddr+len,0);
}

String readFromEeprom(int addr){
  char line[100];
  for(int i = 0; i < 99; i++){
    line[i] = EEPROM.read(addr+i);
    if(line[i] == 0){
      break;
    }
  }
  return String(line);
}


void loadFromFlash() {
  deviceCode = readFromEeprom(0);
  deviceKey = readFromEeprom(100);
  ssid = readFromEeprom(200);
  password = readFromEeprom(300);
  savedHost = readFromEeprom(410);
  savedPort = readFromEeprom(510);
  firstConfigOk = (bool)EEPROM.read(401);
  stateA = (bool)EEPROM.read(402);
  stateB = (bool)EEPROM.read(403);
  stateC = (bool)EEPROM.read(404);
  debugMode = (bool)EEPROM.read(405);
  /*Serial.print(":");
  Serial.print(deviceCode);
  Serial.print(":");
  Serial.print(deviceKey);
  Serial.print(":");
  Serial.print(ssid);
  Serial.print(":");
  Serial.print(password);
  Serial.println(":");*/
}


void saveToFlash() {
  writeToEeprom(deviceCode,0);
  writeToEeprom(deviceKey,100);
  writeToEeprom(ssid,200);
  writeToEeprom(password,300);
  EEPROM.write(401,1);
  EEPROM.write(402,stateA);
  EEPROM.write(403,stateB);
  EEPROM.write(404,stateC);
  EEPROM.write(405,debugMode);
  writeToEeprom(savedHost,410);
  writeToEeprom(savedPort,510);
  EEPROM.commit();
}
