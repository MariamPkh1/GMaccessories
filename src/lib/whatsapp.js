// Builds the right "message us on WhatsApp" link for the visitor's device.
//
// Pure function taking userAgent explicitly, matching the convention in
// inAppBrowser.js, so the branching can be checked against real UA strings
// rather than only being observable on a phone.

/** The shop's WhatsApp number, digits only -- wa.me rejects "+" and spaces. */
export const WHATSAPP_NUMBER = '995557783549'

// Narrow on purpose: this only needs to answer "is there likely a WhatsApp app
// here to hand off to", and a false positive is worse than a false negative --
// sending a desktop user to the app is the exact failure this avoids.
const MOBILE = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile Safari/i

export function isMobileDevice(userAgent) {
  return MOBILE.test(userAgent || '')
}

/**
 * `wa.me` is WhatsApp's own short link and is correct on a phone: it opens the
 * installed app directly in the conversation.
 *
 * On desktop it is unreliable. The browser hands the link to the installed
 * WhatsApp desktop app, which routinely drops the phone number and opens to the
 * chat list instead -- the visitor ends up inside WhatsApp with no idea who they
 * were supposed to be messaging, and no error to explain it. Confirmed on this
 * project: `wa.me/<number>` opened WhatsApp with no chat, while
 * `web.whatsapp.com/send?phone=<number>` opened the conversation correctly.
 *
 * So desktop visitors are sent to web.whatsapp.com, which stays in the browser
 * where the number survives the navigation.
 */
export function whatsappHref(userAgent, phone = WHATSAPP_NUMBER) {
  return isMobileDevice(userAgent)
    ? `https://wa.me/${phone}`
    : `https://web.whatsapp.com/send?phone=${phone}`
}
