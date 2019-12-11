# Celestia Collector
Collect geolocation events with pictures attachments
This project has been developed within the scope of a master’s degree in Geoinformatics at the Cyprus University of Technology

## How to deploy
- npx cap init CelestiaCollector cy.ac.cut.celestia.collector
- npm install
- ionic build

### Add platforms
- npx cap add ios
- npx cap add android

### Open IDE to build, run and deploy
- npx cap open ios
- npx cap open android

### Syncing the app with Capacitor
- npx cap copy ios
- npx cap copy android


npm install -g typescript --save
npm install -g @angular/cli --save
npm install -g ionic --save

ionic start celestia-collector blank
ionic generate service services/map-view
ionic integrations enable capacitor

cd celestia-collector

npm install ion-bottom-drawer --save
npm install hammerjs --save
npm install axios --save
npm install esri-loader --save
npm install form-urlencoded --save
npm install @ionic/pwa-elements --save

npx cap init celestia-collector cy.ac.cut.celestia.collector
npx cap add android
npx cap add ios

index.html
<link rel="stylesheet" href="https://js.arcgis.com/4.13/esri/themes/light/main.css">


src/main.ts
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);
