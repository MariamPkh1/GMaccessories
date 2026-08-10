import { createContext, useCallback, useContext, useMemo } from 'react'
import { CATEGORY_LABELS, DEFAULT_LOCALE, STRINGS } from './strings'

const LocaleContext = createContext(null)

// Deliberately hand-rolled instead of pulling in react-i18next. That library is
// ~40KB gzipped and brings plural rules, namespaces and lazy loading we don't
// use -- this site has a flat string table.
//
// The locale is currently FIXED to Georgian: the ქარ|ENG switcher was removed in
// favour of the browser's own translation, which covers product titles and
// descriptions too (the switcher only ever reached our own UI strings) and works
// for any language rather than just English -- Russian being far likelier here.
//
// The table and t() are kept on purpose. Re-enabling a language picker means
// restoring a useState + setter below; nothing else has to change. See
// OpenInBrowserBar for how non-Georgian speakers are pointed at a real browser.

/**
 * Look up `key`, substituting {placeholders} from `vars`.
 *
 * Falls back through: requested locale -> Georgian -> the key itself. That
 * ordering means a missing English string degrades to readable Georgian rather
 * than to a blank space or a debug token in front of a customer.
 */
export function translate(locale, key, vars) {
  let template = STRINGS[locale]?.[key]

  if (template === undefined) {
    template = STRINGS[DEFAULT_LOCALE]?.[key]
    if (import.meta.env.DEV && template !== undefined) {
      console.warn(`[i18n] missing "${locale}" translation for "${key}"`)
    }
  }

  if (template === undefined) {
    if (import.meta.env.DEV) console.warn(`[i18n] unknown key "${key}"`)
    return key
  }

  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    vars[name] === undefined ? match : String(vars[name]),
  )
}

/**
 * Display label for a category, given the Georgian value stored in the database.
 * Unknown categories fall through unchanged, so adding a ninth category won't
 * blank out the UI before its translation exists.
 */
export function categoryLabel(locale, category) {
  return CATEGORY_LABELS[locale]?.[category] ?? category
}

export function LocaleProvider({ children }) {
  // Fixed, not stateful. `<html lang="ka">` is set statically in index.html and
  // is no longer overwritten at runtime -- that override was actively harmful:
  // setting lang="en" told Chrome the page was already English and suppressed
  // its offer to translate, which is now the whole strategy.
  const locale = DEFAULT_LOCALE

  const t = useCallback((key, vars) => translate(locale, key, vars), [locale])
  const tCategory = useCallback((category) => categoryLabel(locale, category), [locale])

  const value = useMemo(() => ({ locale, t, tCategory }), [locale, t, tCategory])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

/** Shorthand for components that only need the translate function. */
export function useT() {
  return useLocale().t
}
