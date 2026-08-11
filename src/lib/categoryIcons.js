// Single-path line icons for the eight real categories, keyed by the Georgian
// value stored in products.category.
//
// Paths are stroked (fill:none, stroke-width ~1.6) so one shape works at any
// size and inherits currentColor. Unknown categories fall back to FALLBACK_ICON
// rather than rendering an empty circle, so adding a ninth category can't break
// the layout before someone draws an icon for it.
export const CATEGORY_ICONS = {
  'ინტერიერი': 'M8 4h5l1 10H7zM6.5 14h11.5v4H6.5zM8.5 18v2.5M16 18v2.5M18 10h2.5',
  'ექსტერიერი':
    'M3 15l2.2-6A2 2 0 017 8h10a2 2 0 011.8 1l2.2 6v2h-3M6 17H3v-2M8 17h8M6.5 17a1.6 1.6 0 103.2 0M14.3 17a1.6 1.6 0 103.2 0',
  'ელექტრონიკა': 'M9 3v3M15 3v3M9 18v3M15 18v3M6 6h12v12H6zM9.5 9.5h5v5h-5z',
  'განათებები': 'M9.5 18h5M10.5 21h3M12 3a6 6 0 00-3.2 11.1V18h6.4v-3.9A6 6 0 0012 3z',
  'ავტოქიმია': 'M8.5 8h7v13h-7zM10.5 8V5h3v3M15.5 5h3M15.5 8.5h3',
  'სტიკერები': 'M4 4h10l6 6v10H4zM14 4v6h6',
  'გამათბობელი': 'M12 8v8M8 12h8M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6',
  'G&M Gift Box': 'M4 9.5h16V20H4zM4 9.5L5.5 5.5h13L20 9.5M12 5.5V20M9.5 5.5a2 2 0 112-2.5M14.5 5.5a2 2 0 10-2-2.5',
}

export const FALLBACK_ICON = 'M4 7h16v12H4zM4 7l2-3h12l2 3'

export function categoryIcon(category) {
  return CATEGORY_ICONS[category] || FALLBACK_ICON
}

// Material Symbols names matching design/design.html's catalog sidebar.
// Used on the catalog page; the stroked SVG paths above stay for Home's
// category rail, which was drawn for that format.
export const CATEGORY_MATERIAL_ICONS = {
  'ინტერიერი': 'airline_seat_recline_extra',
  'ექსტერიერი': 'speed',
  'ელექტრონიკა': 'memory',
  'განათებები': 'lightbulb',
  'ავტოქიმია': 'clean_hands',
  'სტიკერები': 'sticky_note_2',
  'გამათბობელი': 'mode_heat',
  'G&M Gift Box': 'redeem',
}

export const FALLBACK_MATERIAL_ICON = 'category'

export function categoryMaterialIcon(category) {
  return CATEGORY_MATERIAL_ICONS[category] || FALLBACK_MATERIAL_ICON
}
