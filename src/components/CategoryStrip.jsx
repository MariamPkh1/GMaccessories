import { CATEGORIES, catalogHref } from '../products'
import { categoryMaterialIcon } from '../lib/categoryIcons'

// Square category grid under the editorial hero — matches design/landing-editorial.html.
// Each tile links into the real catalog category route.
export default function CategoryStrip() {
  return (
    <div id="categories" className="mt-14 md:mt-16">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">
            კატეგორიები
          </h2>
          <p className="text-sm text-secondary mt-1">აირჩიეთ განყოფილება</p>
        </div>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
        {CATEGORIES.map((cat) => (
          <a
            key={cat}
            href={catalogHref(cat)}
            className="cat-tile group aspect-square border border-outline-variant bg-white flex flex-col items-center justify-center gap-2 p-2 sm:p-3 text-center text-on-surface transition-all duration-200 hover:-translate-y-[3px] hover:border-primary hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.2)]"
          >
            <span className="material-symbols-outlined text-[26px] sm:text-[28px] text-primary transition-colors">
              {categoryMaterialIcon(cat)}
            </span>
            <span className="text-[11px] sm:text-[13px] font-semibold leading-tight">
              {cat}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
