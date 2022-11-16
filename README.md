# Smart Light Switch using ESP8266

This was a simple app for a smart light switch using ESP8266.
I made this project some time ago and the code is shitty.

I think the UI was cool.
I adapted the code to emulate device connection so it can be used without the real ESP8266 hardware.

This project was made on the las year of high school. I was 17 years old.

## More about the project

The idea was to make a smarth switch that can replace the normal light switch.
And it is was controlled by a mobile app.

This "app" was really a nice web PWA. It has a nice UI and it was really easy to use.
It use socket.io for real time communication. And it was really fast.

Link to the project: [xea.abcd.ar](https://xea.abcd.ar/).

Also, see the photos and videos on [Google Photos Album](https://photos.app.goo.gl/4aNGrXZGodCf92ZD9).

The project is currently abandon.

## Previous version

It had a previous version made in Flutter. Unfortunately, I lost the source code.
But I have some videos testing it on a real place.

See this video: [VIDEO](https://photos.google.com/share/AF1QipMsgXVrWToOgmYFuxDvQsbgIY--WtbpsfxvFUaLBu1ASUmpyL74f-zU_n-dS8T1Wg/photo/AF1QipPoGlzcET_1j03l7ydm1dQgOfIJAOIIyFxOzA24?key=S3JjeUN4RElrbmtLZGpKenJKeHNkaklIX192TndR)

## How to run

You need to have NodeJS installed.

```bash
git clone https://github.com/Martoxdlol/smart-light-key-iot
cd smart-light-key-iot
npm install

# To run it in dev mode
npm dev

# To build and then run it in production mode (not much difference)
npm run build
```


## Network servers

Static file server/Webpack dev server port 9000

Internal api server port 9001

Sockets io port 9002

Device OTA update HTTP server 9004

Internal devices api port 9005

Nginx/HTTP PROXY ports 80 and 443 (http and https)

## Code structure

**arduino_project** - Arduino project for the ESP8266.
It use a TCP connection to communicate with the server.
It doesn't use SSL 😅, but it had a way to check packages integrity.

If you have multiple devices near, the can connect between them as a mesh network or samething like that.

It also has the ability to OTA update the firmware.

### **backend**

**backend/app**: api for the web app.

**backend/admin**: Admin panel web server (I think it never worked).

**backend/update**: OTA update server.

**backend/devices**: Devices api server. It use a TCP connection to communicate with the ESP8266 and HTTP to connect with the web app api server.


### **frontend**

Old setup for a PWA. It was made with React and a custom basic routing system (It has nice animations).

### **html**

Frontend for ESP8266 first setup web server

### **Deploy**

Code that I used to upload code to the server. It was not good. 