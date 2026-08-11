import { fileURLToPath } from 'node:url'
import containerQueries from '@tailwindcss/container-queries'
import forms from '@tailwindcss/forms'

// Absolute, resolved against this file rather than the process working
// directory. Tailwind matches `content` globs relative to cwd, so relative
// paths here would match nothing when the build runs from a parent folder --
// and a no-match produces an empty stylesheet rather than an error.
const here = (p) => fileURLToPath(new URL(p, import.meta.url))

/** @type {import('tailwindcss').Config} */

// Moved here verbatim from the inline <script> in index.html, which configured
// the Tailwind Play CDN. The CDN compiled this stylesheet in every visitor's
// browser on every page load; this file does the same work once, at build time.
//
// `content` is what Tailwind scans to decide which classes to emit. Anything not
// found here is stripped from the output, so a class assembled at runtime (e.g.
// `text-${color}`) would silently lose its styling. Every class in this codebase
// is a complete literal string, which is what makes that safe.
export default {
  content: [here('./index.html'), here('./src/**/*.{js,jsx}')],
  darkMode: 'class',
  theme: {
    extend: {
      // "Editorial Minimalism" palette — near-black text, white canvas,
      // deep navy reserved for accents only (buttons/active/links).
      // Token NAMES are unchanged from the old palette on purpose, so
      // every existing component inherits the new look for free.
      colors: {
        secondary: '#6b7280',
        'on-error': '#ffffff',
        'tertiary-fixed': '#e5e7eb',
        'surface-container': '#f5f5f5',
        'on-primary-fixed': '#ffffff',
        background: '#ffffff',
        'secondary-fixed': '#e5e7eb',
        'on-surface-variant': '#6b7280',
        'primary-fixed': '#d6e0ea',
        'tertiary-fixed-dim': '#d1d5db',
        'surface-dim': '#f5f5f5',
        'on-surface': '#0a0a0a',
        'on-primary-fixed-variant': '#1e3a5f',
        'error-container': '#fee2e2',
        'surface-bright': '#ffffff',
        'on-secondary-fixed': '#1a1a1a',
        'on-tertiary-container': '#374151',
        'on-error-container': '#991b1b',
        surface: '#ffffff',
        'inverse-on-surface': '#fafafa',
        'outline-variant': '#e5e5e5',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#f3f4f6',
        'surface-container-low': '#fafafa',
        // Catalog surface set. Cards there share the page tint rather than
        // being white, so they depend on a *visible* border and a darker
        // image well to read as cards at all — the default
        // outline-variant (#e5e5e5) and surface-container (#f5f5f5) are
        // both too close to the page to separate anything.
        'surface-page': '#f7f9fb',
        'surface-well': '#eceef0',
        'outline-card': '#c6c6cd',
        // Was referenced by dropdown panels but never defined, which made
        // them render with no background at all.
        'surface-container-lowest': '#ffffff',
        'secondary-fixed-dim': '#9ca3af',
        'on-background': '#0a0a0a',
        'surface-container-highest': '#e5e5e5',
        'on-secondary': '#ffffff',
        'on-primary': '#ffffff',
        outline: '#d1d5db',
        'secondary-container': '#f3f4f6',
        'primary-container': '#24466f',
        'primary-fixed-dim': '#9db3c9',
        'on-secondary-container': '#374151',
        tertiary: '#1a1a1a',
        'surface-container-high': '#f0f0f0',
        'surface-tint': '#1e3a5f',
        'inverse-surface': '#1a1a1a',
        'on-tertiary-fixed-variant': '#374151',
        'on-primary-container': '#ffffff',
        'on-secondary-fixed-variant': '#374151',
        'surface-variant': '#f5f5f5',
        'inverse-primary': '#9db3c9',
        primary: '#1e3a5f',
        'on-tertiary-fixed': '#0a0a0a',
        error: '#dc2626',
      },
      borderRadius: {
        DEFAULT: '2px',
        lg: '4px',
        xl: '4px',
        full: '4px',
      },
      spacing: {
        gutter: '24px',
        'stack-md': '24px',
        'container-padding': '64px',
        'stack-lg': '48px',
        'stack-sm': '8px',
        'sidebar-width': '280px',
      },
      fontFamily: {
        'button-text': ['Noto Sans Georgian', 'system-ui', 'sans-serif'],
        'headline-lg': ['Noto Sans Georgian', 'system-ui', 'sans-serif'],
        'label-sm': ['Noto Sans Georgian', 'system-ui', 'sans-serif'],
        'body-md': ['Noto Sans Georgian', 'system-ui', 'sans-serif'],
        'display-lg': ['Noto Sans Georgian', 'system-ui', 'sans-serif'],
        'headline-lg-mobile': ['Noto Sans Georgian', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'button-text': ['14px', { lineHeight: '1', letterSpacing: '0.01em', fontWeight: '600' }],
        'headline-lg': ['24px', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '700' }],
        'label-sm': ['12px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'display-lg': ['40px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-lg-mobile': [
          '24px',
          { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
      },
    },
  },
  plugins: [forms, containerQueries],
}
