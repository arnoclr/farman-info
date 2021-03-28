# Farman Web App

Farman web application is built with vuejs and google firebase.

![screenshot de la page de connexion](https://i.imgur.com/T9HLTyr.jpg)

→ [https://farman.info](https://farman.info?utm_source=github_readme)

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