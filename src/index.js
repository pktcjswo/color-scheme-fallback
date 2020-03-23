const MQ_DARK = '(prefers-color-scheme: dark)'
const NOT_ALL = 'not all'
const ALL = 'all'
const FB_NAME = 'drkmd'
const SCHEME_DARK = 'dark'
const SCHEME_LIGHT = 'light'
const STORE_NAME = 'ColorSchemeFallback'
const store = localStorage

/**
 * @typedef ColorSchemeFallbackOpts
 * @property {(scheme:string)=>{}} onChange callback function when color scheme has changed
 * @property {boolean} storeScheme - true/false
 * @property {string} hashFlag - which name to watch for color scheme (default: drkmd)
 * @property {boolean} nativeFirst - false if you want to set only by manually using hashFlag
 */
const defaultOpts = {
  /** @param {string} scheme - 'dark', 'light' */
  onChange: (scheme) => { },
  storeScheme: false,
  hashFlag: FB_NAME,
  nativeFirst: true
}

/**
 * Color Scheme fallback
 * @param {ColorSchemeFallbackOpts} [opts]
 * @return {*} removeHandler
 */
function ColorSchemeFallback(opts) {
  this.opts = Object.assign({}, defaultOpts, opts)
  this.media = window.matchMedia(MQ_DARK)
  this.isNativeSupport = this.media.media !== NOT_ALL
  this._darkCSS = document.querySelectorAll(`link[rel=stylesheet][media='${MQ_DARK}']`)
  this.scheme = ''

  this.handleChange()

  window.addEventListener("hashchange", this.handleChange, false)
  if ('addEventListener' in this.media) {
    this.media.addEventListener('change', this.handleChange)
  } else if ('addListener' in media) {
    this.media.addListener(this.handleChange)
  }
}

/**
 * detect dark mode status and update scheme value
 */
ColorSchemeFallback.prototype.handleChange = function () {
  let prevScheme = this.scheme

  if (this.isNativeSupport && this.opts.nativeFirst) {
    // Good, browser natively support (only if 'matches' works correctly)
    this.scheme = this.media.matches ? SCHEME_DARK : SCHEME_LIGHT
  } else {
    // How we can turn on/off dark mode on some legacy device environments ?
    // As an alternative way, we also check hash value, 'drkmd'.
    // By watching the value, we will force-change media query accordingly,
    // which was supposed to be applied on recent OS browsers.
    let p = window.location.hash.indexOf(this.opts.hashFlag)
    if (p >= 0) {
      // 1. explicitly and manually change darkmode
      let sub = window.location.hash.substr(p + this.opts.hashFlag.length)
      this.scheme = (sub.indexOf('=0') != 0 && sub.indexOf('=n') != 0) ? SCHEME_DARK : SCHEME_LIGHT
      try {
        store.setItem(STORE_NAME, this.scheme)
      } catch(e) { /* Nothing */ }
    } else {
      // 2. preserve previous value or set just light mode
      let _scheme = SCHEME_LIGHT
      try {
        _scheme = store.getItem(STORE_NAME)
      } catch(e) { /* Nothing */ }
      this.scheme = _scheme
    }
  }

  if (prevScheme !== this.scheme) {
    this.update()
    this.opts.onChange && this.opts.onChange(this.scheme)
  }
}

ColorSchemeFallback.prototype.remove = function () {
  if ('removeEventListener' in this.media) {
    this.media.removeEventListener('change', this.handleChange)
  } else if ('removeListener' in this.media) {
    this.media.removeListener(this.handleChange)
  }
  this.opts = {}
}

/**
 * update link media query to apply dark mode accordingly
 * let dark css override normal default css
 * @param {string} [scheme] new scheme to change to ('dark'/'light')
 */
ColorSchemeFallback.prototype.update = function (scheme) {
  if (scheme) {
    this.scheme = scheme
  }
  let bDark = this.scheme === SCHEME_DARK
  for (let i = 0, n = this._darkCSS.length; i < n; ++i) {
    let link = this._darkCSS[i]
    link.media = bDark ? ALL : NOT_ALL
    link.disabled = bDark ? false : true
  }
}

export default ColorSchemeFallback
