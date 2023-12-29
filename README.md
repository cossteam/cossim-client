# IM Demo

## Framework7 CLI Options

Framework7 app created with following options:

```
{
  "cwd": "/Users/mac-os12/Documents/project/im/im-demo",
  "type": [
    "cordova"
  ],
  "name": "IM Demo",
  "framework": "react",
  "template": "tabs",
  "bundler": "vite",
  "cssPreProcessor": "less",
  "theming": {
    "customColor": false,
    "color": "#007aff",
    "darkMode": false,
    "iconFonts": true
  },
  "customBuild": false,
  "pkg": "com.xm.imdemo",
  "cordova": {
    "folder": "cordova",
    "platforms": [
      "ios",
      "android"
    ],
    "plugins": [
      "cordova-plugin-statusbar",
      "cordova-plugin-keyboard",
      "cordova-plugin-splashscreen",
      "cordova-plugin-file",
      "cordova-plugin-inappbrowser",
      "cordova-plugin-device",
      "cordova-plugin-media"
    ]
  }
}
```

## Install Dependencies

First of all we need to install dependencies, run in terminal
```
npm install
```

## NPM Scripts

* 🔥 `start` - run development server
* 🔧 `dev` - run development server
* 🔧 `build` - build web app for production
* 📱 `build-cordova` - build cordova app
* 📱 `build-cordova-ios` - build cordova iOS app
* 📱 `cordova-ios` - run dev build cordova iOS app
* 📱 `build-cordova-android` - build cordova Android app
* 📱 `cordova-android` - run dev build cordova Android app

## Vite

There is a [Vite](https://vitejs.dev) bundler setup. It compiles and bundles all "front-end" resources. You should work only with files located in `/src` folder. Vite config located in `vite.config.js`.
## Cordova

Cordova project located in `cordova` folder. You shouldn't modify content of `cordova/www` folder. Its content will be correctly generated when you call `npm run cordova-build-prod`.



## Assets

Assets (icons, splash screens) source images located in `assets-src` folder. To generate your own icons and splash screen images, you will need to replace all assets in this directory with your own images (pay attention to image size and format), and run the following command in the project directory:

```
framework7 assets
```

Or launch UI where you will be able to change icons and splash screens:

```
framework7 assets --ui
```



## Documentation & Resources

* [Framework7 Core Documentation](https://framework7.io/docs/)

* [Framework7 React Documentation](https://framework7.io/react/)

* [Framework7 Icons Reference](https://framework7.io/icons/)
* [Community Forum](https://forum.framework7.io)

## Support Framework7

Love Framework7? Support project by donating or pledging on:
- Patreon: https://patreon.com/framework7
- OpenCollective: https://opencollective.com/framework7