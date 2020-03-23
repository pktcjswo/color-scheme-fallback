![Node.js Package](https://github.com/pktcjswo/color-scheme-fallback/workflows/Node.js%20Package/badge.svg?branch=master)

# color-scheme-fallback

### color-scheme-change with legacy fallback way (using hash parameter)
How we can turn on/off dark mode on some legacy device environments?  
As an alternative way, it checks hash value, (e.g. '#?drkmd=y'), updates the color scheme, and stores the value for later visit.  
Programmatically, you will be able to force-change media query accordingly.

## install
```bash
$ npm i --save color-scheme-fallback
```

## API
```js
new ColorSchemeFallback({
 onChange: (scheme) => {}, // callback function when color scheme has changed
 storeScheme: true         // true/false
 hashFlag: 'darkmode',     // which name to watch for color scheme (default: drkmd)
 nativeFirst: true         // false, if you want to set only by manually using hashFlag
})
```
