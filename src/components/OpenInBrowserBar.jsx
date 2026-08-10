import { useEffect, useState } from 'react'
import {
  androidChromeUrl,
  isIOS,
  shouldOfferBrowserHandoff,
} from '../lib/inAppBrowser'

const DISMISS_KEY = 'gm-browser-hint-dismissed'

// Points non-Georgian speakers at a real browser, where the built-in translation
// can render the whole page -- product titles and descriptions included -- in
// any language. Instagram, Facebook and TikTok webviews have no translate
// feature at all, so without this there is no route to a translated page.
//
// Deliberately NOT a modal. A content-blocking interstitial is treated as a
// ranking negative by Google and is disliked by users; this is a slim,
// dismissible bar that never covers the page content.
//
// The copy is in English on purpose: the only people who ever see this bar are
// the ones who cannot read Georgian, so a Georgian message would be useless to
// its entire audience.
export default function OpenInBrowserBar() {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let dismissed = false
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      // Storage unavailable: treat as not dismissed rather than crashing.
    }
    if (dismissed) return

    setVisible(
      shouldOfferBrowserHandoff({
        userAgent: navigator.userAgent,
        // navigator.languages is the ordered list the user actually configured;
        // navigator.language is only the top one.
        languages: navigator.languages || [navigator.language],
      }),
    )
  }, [])

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Not remembering the dismissal is survivable.
    }
  }

  const ios = isIOS(navigator.userAgent)
  const chromeUrl = androidChromeUrl(window.location.href)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked; the instruction text still tells them what to do.
    }
  }

  return (
    <div
      lang="en"
      role="region"
      aria-label="Open in browser"
      className="fixed bottom-0 left-0 right-0 z-[90] bg-on-surface text-white shadow-lg"
    >
      <div className="px-4 py-2.5 flex items-center gap-3 text-xs leading-snug">
        <span className="material-symbols-outlined text-[18px] shrink-0">translate</span>

        <p className="flex-1">
          {ios ? (
            <>
              For English or Russian, open this page in your browser — tap{' '}
              <strong>•••</strong> then <strong>Open in browser</strong>, then use Translate.
            </>
          ) : (
            <>Open this page in your browser to translate it into your language.</>
          )}
        </p>

        {/* Android is the only platform where the handoff can actually be
            performed; iOS gets a copy-link fallback instead. */}
        {!ios && chromeUrl ? (
          <a
            href={chromeUrl}
            className="shrink-0 bg-white text-on-surface font-semibold rounded px-3 py-1.5 whitespace-nowrap"
          >
            Open
          </a>
        ) : (
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 bg-white text-on-surface font-semibold rounded px-3 py-1.5 whitespace-nowrap"
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
        )}

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 p-1 text-white/70 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  )
}
