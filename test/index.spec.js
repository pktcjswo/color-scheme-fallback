import { matchMediaWith } from './matchMedia.mock.js'
import ColorSchemeFallback from '../dist/index.esm.js'

describe('ColorSchemeFallback', () => {
  it('checks media query without native support', () => {
    matchMediaWith({ media: 'not all', matches: false })
    let csf = new ColorSchemeFallback()
    expect(csf.isNativeSupport).toBe(false)
  })

  it('checks media query with native support', () => {
    matchMediaWith({ media: '(..)', matches: true })
    let csf = new ColorSchemeFallback()
    expect(csf.isNativeSupport).toBe(true)
  })
})
