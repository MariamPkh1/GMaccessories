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

const BRAND = 'G&M აქსესუარები'

export default function Footer() {
  return (
    <footer className="bg-[#0f1a2a] mt-auto">
      <div className="w-full px-container-padding py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-headline-lg text-base text-white">{BRAND}</span>
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} {BRAND}. ყველა უფლება დაცულია.
          </p>
          {/* Plain href, not a hash route: privacy.html is a real static file so
              that crawlers (Facebook's app review in particular) receive the
              actual policy text rather than the empty SPA shell. */}
          <a
            href="/privacy.html"
            className="text-xs text-white/55 hover:text-white transition-colors underline underline-offset-2"
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
              className="text-sm font-medium text-white/65 hover:text-white transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>

        <a
          href={`tel:${PHONE.replace(/\s/g, '')}`}
          className="text-sm font-medium text-white hover:text-white/85 transition-colors"
        >
          {PHONE}
        </a>
      </div>
    </footer>
  )
}
