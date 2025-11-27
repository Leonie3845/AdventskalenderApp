# Adventskalender App

## install apk on your android device
In github, download app-bundle.zip, extract it and transfer the apk to your device. 

On your Android phone:
- Go to Settings → Apps → Special app access → Install unknown apps
- Select the app you’ll use to open the APK (e.g., Chrome, Gmail, Files)
- Enable “Allow from this source”

Then it can be installed.


## Setup of dev environment
You need node, npm and ionic installed

to run it locally:
```
cd adventskalender-app
ionic serve
```

to build it locally:

First add Capacitor for native builds
````shell
ionic build
ionic cap add android
#run sync after changes
ionic cap sync
````


To build it manually:
````shell
cd android
./gradlew assembleDebug

````
This will create ``android/app/build/outputs/apk/debug/app-debug.apk``


## How to install it on android phone in dev mode


Hallo du Glücklicher Mensch! 
Der ultimative Leonie'sche Advendskalender ist da. Freust du dich auch schon so sehr wie ich?🤩🎄


Um die App zu installieren musst du in den Einstellungen das Installieren unbekannter Apps über Whatsapp erlauben. Dafür navigierst du:

Einstellungen → Apps → Spezieller App-Zugriff → Installieren Unbekannter Apps → Whatsapp auswählen und dort auf Dieser Quelle Vertrauen auswählen.

Dannach die app-debug.apk Datei herunterladen (indem du sie im Whatsapp chat anklickst), die Datei dann erneut anklicken → bei "Mit Packetinstallation öffenen" nur diesmal auswählen

Im Dialog "Möchtest du diese App Installieren?" → Installieren klicken.
Im Dialog "App-Scan empfohlen" → App Scannen klicken. Kurz warten → Installieren klicken.


Dannach ist die Adventskalender App installiert. Du kannst sie als Test direkt einmal öffnen. Viel Spaß!🎁
