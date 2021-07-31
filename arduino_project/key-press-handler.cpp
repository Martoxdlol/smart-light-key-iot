#include "Arduino.h"
#include "global.h"
#include "util.h"



/*

bool tmpState[3];
bool avoidNextKeyUp[3];
int tmpStateMS[3];

int getPin(int pinCode){
    if(pinCode = 'A'){
        return 12;
    }else if(pinCode = 'B'){
        return 13;
    }else{
        return 14;
    }
}

void voidCheckIfMultiLongPress(){
    bool b = true;
    for(int i = 0; i < 3; i++){
        if(tmpState[i] && tmpStateMS[i] + 8000 < millis() && tmpStateMS[i] + 80000 > millis()){}else{
            b = false;
            break;
        }
    }
    if(b){
        avoidNextKeyUp[0] = true;
        avoidNextKeyUp[1] = true;
        avoidNextKeyUp[2] = true;
        //Send to server
    }
}

void handleChangePin(int pinCode){
    Serial.println('******************* INTERRUPT *************');
    int pin = getPin(pinCode);
    int i = pin-12;
    voidCheckIfMultiLongPress();
    bool state = digitalRead(pin);
    tmpState[i] = state;
    int tmpMS = tmpStateMS[i];
    tmpStateMS[i] = millis();
    if(state){
        //Key down
    }else{
        //Key up
        if(tmpMS+20 > millis()){
            //Click too fast, ignore
        }else
        if(avoidNextKeyUp[i]){
            avoidNextKeyUp[i] = false;
            //Do nothing
        }else{
            //Do something
            //Change state
            if(i == 0){
                stateA = !stateA;
                digitalWrite(5,stateA);
            }else if(i == 1){
                stateB = !stateB;
                digitalWrite(4,stateB);
            }else{
                stateC = !stateC;
                digitalWrite(16,stateC);
            }
            Serial.println("********************************");
            Serial.println("***********KEY PRESS************");
            Serial.print("Key: ");Serial.print(i);Serial.print(", PIN: ");Serial.print(pin);Serial.print(", STATE: ");Serial.println(state);
            Serial.println("********************************");
            //Report state
        }
    }
    delay(2);
}


void ICACHE_RAM_ATTR IntCallbackA(){
    noInterrupts();
    handleChangePin('A');
    interrupts();
}


void ICACHE_RAM_ATTR IntCallbackB(){
    noInterrupts();
    handleChangePin('B');
    interrupts();
}

void ICACHE_RAM_ATTR IntCallbackC(){
    noInterrupts();
    handleChangePin('C');
    interrupts();
}

void initKeys() {
    pinMode(12, INPUT_PULLUP);
    pinMode(13, INPUT_PULLUP);
    pinMode(14, INPUT_PULLUP);
    digitalWrite(5, stateA);
    digitalWrite(4, stateB);
    digitalWrite(16, stateC);
    delay(5);
    attachInterrupt(digitalPinToInterrupt(14), IntCallbackA, CHANGE);
    delay(5);
    attachInterrupt(digitalPinToInterrupt(13), IntCallbackB, CHANGE);
    delay(5);
    attachInterrupt(digitalPinToInterrupt(12), IntCallbackC, CHANGE);
}

*/

unsigned long msKeyA = 0;
unsigned long msKeyB = 0;
unsigned long msKeyC = 0;

void ICACHE_RAM_ATTR IntCallbackA(){
    if(msKeyA + 50 < millis()){
        stateA = !stateA;
        updateOutputs();
        Serial.print("PRESSED A, changed to ");Serial.println(stateA);
        msKeyA = millis();
        sendUpdateRequired = true;
    }
}


void ICACHE_RAM_ATTR IntCallbackB(){
    if(msKeyB + 50 < millis()){
        stateB = !stateB;
        updateOutputs();
        Serial.print("PRESSED B, changed to ");Serial.println(stateB);
        msKeyB = millis();
        sendUpdateRequired = true;
    }
}

void ICACHE_RAM_ATTR IntCallbackC(){
    if(msKeyC + 50 < millis()){
        stateC = !stateC;
        updateOutputs();
        Serial.print("PRESSED C, changed to ");Serial.println(stateC);
        msKeyC = millis();
        sendUpdateRequired = true;
    }
}


void initKeys() {
    pinMode(12, INPUT_PULLUP);
    pinMode(13, INPUT_PULLUP);
    pinMode(14, INPUT_PULLUP);
    pinMode(16, OUTPUT);
    pinMode(4, OUTPUT);
    pinMode(5, OUTPUT);
    updateOutputs();
    delay(5);
    attachInterrupt(digitalPinToInterrupt(14), IntCallbackA, RISING);
    delay(5);
    attachInterrupt(digitalPinToInterrupt(13), IntCallbackB, RISING);
    delay(5);
    attachInterrupt(digitalPinToInterrupt(12), IntCallbackC, RISING);
    delay(5);
    msKeyA = millis();
    msKeyB = millis();
    msKeyC = millis();
}