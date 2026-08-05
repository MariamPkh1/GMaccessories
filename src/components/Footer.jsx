// Single shared footer. Previously each page carried its own copy, which meant
// the social links had to be kept in sync by hand in five places.
// URLs are the canonical profile links with share/tracking params
// (fbclid, igsh, utm_*, _t, _r) stripped.
const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100087906273272' },
  { label: 'Instagram', href: 'https://www.instagram.com/g_m____accessories' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@_gm_200' },
  { label: 'YouTube', href: 'https://www.youtube.com/@gmproductiongm' },
]

const PHONE = '557 78 35 49'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-outline-variant mt-auto">
      <div className="w-full px-container-padding py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-headline-lg text-base text-on-surface">G&M აქსესუარები</span>
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} G&M აქსესუარები. ყველა უფლება დაცულია.
          </p>
          {/* Plain href, not a hash route: privacy.html is a real static file so
              that crawlers (Facebook's app review in particular) receive the
              actual policy text rather than the empty SPA shell. */}
          <a
            href="/privacy.html"
            className="text-xs text-on-surface-variant hover:text-primary transition-colors underline underline-offset-2"
          >
            კონფიდენციალურობის პოლიტიკა
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>

        <a
          href={`tel:${PHONE.replace(/\s/g, '')}`}
          className="text-sm font-medium text-on-surface hover:text-primary transition-colors"
        >
          {PHONE}
        </a>
      </div>
    </footer>
  )
}
