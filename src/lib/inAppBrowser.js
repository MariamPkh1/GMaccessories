// Detection for the "open in a real browser" hint.
//
// Kept as pure functions taking userAgent/languages explicitly rather than
// reading globals, so the matching can be unit-checked against real UA strings
// instead of only being observable on a phone.

// User-agent sniffing is unreliable in general, but it is the only way to spot
// an embedded webview -- there is no feature test for "this browser has no
// translate menu". Matching is deliberately narrow: each pattern is a token the
// host app injects, so a normal Chrome/Safari UA cannot match by accident.
const IN_APP_PATTERNS = [
  /Instagram/i,
  /FBAN|FBAV|FB_IAB|FBIOS/i, // Facebook & Messenger
  /BytedanceWebview|musical_ly|Bytelocale/i, // TikTok
  /Line\//i,
  /Snapchat/i,
  /Pinterest/i,
]

/** True when the page is running inside a social app's embedded browser. */
export function isInAppBrowser(userAgent) {
  const ua = userAgent || ''
  return IN_APP_PATTERNS.some((re) => re.test(ua))
}

/**
 * True when none of the visitor's preferred languages is Georgian.
 *
 * This is the gate that keeps the hint away from the people who don't need it:
 * the overwhelming majority of visitors read Georgian and would only be
 * annoyed by a prompt to leave the app.
 */
export function prefersNonGeorgian(languages) {
  const list = (languages && languages.length ? languages : []).filter(Boolean)
  if (list.length === 0) return false // Unknown: assume local, stay quiet.
  return !list.some((l) => String(l).toLowerCase().startsWith('ka'))
}

/**
 * Whether to offer the browser handoff at all.
 *
 * Both conditions must hold: inside a webview (so no translate feature exists)
 * AND not a Georgian speaker (so translation is actually wanted).
 */
export function shouldOfferBrowserHandoff({ userAgent, languages } = {}) {
  return isInAppBrowser(userAgent) && prefersNonGeorgian(languages)
}

/** iOS needs different instructions, because nothing can be automated there. */
export function isIOS(userAgent) {
  const ua = userAgent || ''
  return /iPhone|iPad|iPod/i.test(ua)
}

/**
 * An Android intent:// URL that hands the current page to Chrome.
 *
 * Android is the only platform where the handoff can be performed rather than
 * merely described. Apple removed the equivalent (`x-safari-https://`) years
 * ago, so on iOS the bar explains the ••• menu instead.
 *
 * The fragment is deliberately dropped. `#Intent;...;end` is itself a fragment,
 * and Android parses the FIRST `#` as the start of the intent parameters -- so a
 * hash route like `#/catalog` would corrupt the intent and the handoff would
 * fail silently. Since this app routes entirely on the hash, the visitor lands
 * on the home page in Chrome rather than the exact page. Losing their place is a
 * far better outcome than a button that does nothing.
 */
export function androidChromeUrl(href) {
  try {
    const url = new URL(href)
    const withoutSchemeOrHash = `${url.host}${url.pathname}${url.search}`
    return `intent://${withoutSchemeOrHash}#Intent;scheme=https;package=com.android.chrome;end`
  } catch {
    return null
  }
}
