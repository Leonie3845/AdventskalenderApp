# MeteoApp

## install apk on your android device
In github, download app-bundle.zip, extract it and transfer the apk to your device. 

On your Android phone:
- Go to Settings → Apps → Special app access → Install unknown apps
- Select the app you’ll use to open the APK (e.g., Chrome, Gmail, Files)
- Enable “Allow from this source”

Then it can be installed.


## Research and available Apis

### Open-meteo

https://open-meteo.com/en/docs/dwd-api?hourly=temperature_2m,precipitation

Example Api:
https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,precipitation&models=icon_seamless

- damit starten.

### For Bodendruck Karten:

- noch herausfinden.

## Setup of dev environment
You need node, npm and ionic installed

to run it locally:
```
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