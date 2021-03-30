# Farman Web App

Farman publishes news on airlines, airports, travel tips and travel tips every week to find out all about air transport and civil aviation in France.

[![install](https://i.imgur.com/RPOS6Bo.png)](https://farman.info?utm_source=github_readme)

## Screenshots

Magazines|Login|Publish
-|-|-
![](https://i.imgur.com/Mmpde8j.png)|![](https://i.imgur.com/Vb0UIhd.png)|![](https://i.imgur.com/5VSvc48.png)

*Farman web application is built with vuejs and google firebase.*

# Test

You can run app in localhost by typing :
```sh
npm install
npm run serve
```
After, open website on http://localhost:8080/

or build assets with this command :
```sh
npm run build
```

Test firestore rules :
```sh
firebase emulators:exec --only firestore "npm run test-firestore"
```