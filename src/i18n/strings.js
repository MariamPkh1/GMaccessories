// Flat dotted keys rather than nested objects, so a Georgian string and its
// English counterpart sit on the same key and a missing translation is obvious
// when diffing the two blocks.
//
// Georgian is the source language: `ka` is always complete, and `en` may lag.
// t() falls back ka -> key, so an untranslated string shows Georgian rather
// than a blank or a raw key.

export const LOCALES = ['ka', 'en']
export const DEFAULT_LOCALE = 'ka'

// Unused while the locale is fixed to Georgian. Retained so a language picker
// can be restored without reconstructing it.
export const LOCALE_LABELS = {
  ka: 'ქარ',
  en: 'ENG',
}

// Categories are stored in products.category as their Georgian label, and the
// URL hash uses the same value (#/catalog/ავტოქიმია). Rather than migrate every
// product row and break existing links, the stored Georgian value stays the key
// and only the *display* label is translated. Hash routes aren't indexed by
// search engines anyway, so there's no SEO argument for English URLs here.
export const CATEGORY_LABELS = {
  en: {
    'ინტერიერი': 'Interior',
    'ექსტერიერი': 'Exterior',
    'ელექტრონიკა': 'Electronics',
    'განათებები': 'Lighting',
    'ავტოქიმია': 'Car care',
    'სტიკერები': 'Stickers',
    'გამათბობელი': 'Heaters',
    'G&M Gift Box': 'G&M Gift Box',
  },
}

export const STRINGS = {
  ka: {
    // --- brand / generic ---------------------------------------------------
    'brand.name': 'G&M აქსესუარები',
    'common.loading': 'იტვირთება...',
    'common.close': 'დახურვა',
    'common.menu': 'მენიუ',
    'common.search': 'ძებნა',
    'common.currency': '₾',
    'common.language': 'ენა',

    // --- navigation --------------------------------------------------------
    'nav.home': 'მთავარი',
    'nav.catalog': 'კატალოგი',
    'nav.favorites': 'ფავორიტები',
    'nav.cart': 'კალათა',
    'nav.orders': 'ჩემი შეკვეთები',
    'nav.categories': 'კატეგორიები',

    // --- account -----------------------------------------------------------
    'account.signIn': 'შესვლა',
    'account.signOut': 'გასვლა',
    'account.adminPanel': 'ადმინ პანელი',
    'account.myOrders': 'ჩემი შეკვეთები',

    // --- auth modal --------------------------------------------------------
    'auth.title': 'შესვლა ან რეგისტრაცია',
    'auth.subtitle': 'აირჩიეთ ერთი მეთოდი — პაროლის შექმნა არ დაგჭირდებათ',
    'auth.continueGoogle': 'გაგრძელება Google-ით',
    'auth.continueFacebook': 'გაგრძელება Facebook-ით',
    'auth.consent': 'გაგრძელებით ეთანხმებით',
    'auth.privacyPolicy': 'კონფიდენციალურობის პოლიტიკას',
    'auth.error.generic': 'დაფიქსირდა შეცდომა. სცადეთ მოგვიანებით.',
    'auth.error.rateLimit': 'ბევრი მცდელობა მოხდა მოკლე დროში. სცადეთ მოგვიანებით.',
    'auth.error.providerDisabled': 'ავტორიზაციის ეს მეთოდი დროებით მიუწვდომელია.',

    // --- route guard -------------------------------------------------------
    'guard.signInRequired': 'გასაგრძელებლად გაიარეთ ავტორიზაცია',
    'guard.adminOnly': 'ეს გვერდი მხოლოდ ადმინისტრატორისთვისაა',

    // --- search ------------------------------------------------------------
    'search.placeholder': 'მოძებნეთ პროდუქტი...',
    'search.noResults': 'პროდუქტი ვერ მოიძებნა',

    // --- footer ------------------------------------------------------------
    'footer.rights': 'ყველა უფლება დაცულია.',
    'footer.privacy': 'კონფიდენციალურობის პოლიტიკა',

    // --- price -------------------------------------------------------------
    // `-დან` is a postposition, so it attaches to the end of the amount.
    'price.from': '{amount}-დან',

    // --- catalog -----------------------------------------------------------
    'catalog.title': 'კატალოგი',
    'catalog.all': 'ყველა',
    'catalog.category': 'კატეგორია',
    'catalog.sort': 'სორტირება',
    'catalog.sort.newest': 'უახლესი',
    'catalog.sort.priceAsc': 'ფასი: დაბლიდან მაღლა',
    'catalog.sort.priceDesc': 'ფასი: მაღლიდან დაბლა',
    'catalog.filter': 'ფილტრი',
    'catalog.filter.price': 'ფასი (₾)',
    'catalog.filter.min': 'დან',
    'catalog.filter.max': 'მდე',
    'catalog.filter.apply': 'გამოყენება',
    'catalog.filter.clear': 'გასუფთავება',
    'catalog.empty': 'პროდუქტები ვერ მოიძებნა',
    'catalog.prevPage': 'წინა გვერდი',
    'catalog.nextPage': 'შემდეგი გვერდი',
    'catalog.goToCatalog': 'კატალოგზე გადასვლა',
    'catalog.viewCatalog': 'კატალოგის ნახვა',

    // --- product -----------------------------------------------------------
    'product.addToCart': 'კალათაში დამატება',
    'product.added': 'დამატებულია',
    'product.size': 'ზომა:',
    'product.description': 'აღწერა',
    'product.specifications': 'მახასიათებლები',
    'product.watchVideo': 'დააწკაპე ვიდეოს სანახავად',
    'product.addToFavorites': 'ფავორიტებში დამატება',
    'product.inFavorites': 'ფავორიტებშია',
    'product.notFound': 'პროდუქტი ვერ მოიძებნა',
    'product.related': 'შეიძლება დაგაინტერესოთ',
    'product.viewAll': 'ყველას ნახვა',

    // --- favorites ---------------------------------------------------------
    'favorites.title': 'ფავორიტები',
    'favorites.empty': 'თქვენი ფავორიტების სია ცარიელია',
    'favorites.remove': 'წაშლა ფავორიტებიდან',

    // --- cart --------------------------------------------------------------
    'cart.title': 'კალათა',
    'cart.itemCount': '{count} ნივთი',
    'cart.empty': 'თქვენი კალათა ცარიელია',
    'cart.summary': 'შეჯამება',
    'cart.itemsTotal': 'ნივთების ღირებულება:',
    'cart.delivery': 'მიწოდება:',
    'cart.estimatedTotal': 'სავარაუდო ჯამი:',
    'cart.fullName': 'სახელი და გვარი',
    'cart.fullNamePlaceholder': 'ჩაწერეთ სახელი...',
    'cart.phone': 'ტელეფონის ნომერი',
    'cart.notesPlaceholder': 'შენიშვნა (არასავალდებულო)',
    'cart.submit': 'შეკვეთის გაფორმება',
    'cart.submitting': 'იგზავნება...',
    'cart.submitted': 'გაგზავნილია',
    'cart.noOnlinePayment':
      'ეს არის მოთხოვნა შესყიდვაზე — გადახდა არ ხდება ონლაინ. ჩვენი გუნდი დაგიკავშირდებათ დეტალების დასაზუსტებლად.',
    'cart.error.missingContact': 'შეავსეთ სახელი და ტელეფონის ნომერი.',
    'cart.error.submitFailed': 'შეკვეთის გაგზავნა ვერ მოხერხდა. სცადეთ თავიდან.',
    'cart.success.title': 'შეკვეთის მოთხოვნა გაგზავნილია',
    'cart.success.body':
      'ჩვენი გუნდი მალე დაგიკავშირდებათ. სტატუსის ნახვა შეგიძლიათ „ჩემი შეკვეთების“ გვერდზე.',
    'cart.success.viewOrders': 'ჩემი შეკვეთების ნახვა',

    // --- orders ------------------------------------------------------------
    'orders.title': 'ჩემი შეკვეთები',
    'orders.number': 'შეკვეთა #{id}',
    'orders.total': 'ჯამი',
    'orders.deletedProduct': 'პროდუქტი წაშლილია',
    'orders.empty': 'შეკვეთები არ გაქვთ',
    'orders.emptyHint': 'გაგზავნეთ შეკვეთის მოთხოვნა კალათიდან და აქ ნახავთ მის სტატუსს',
    'orders.status.pending': 'მოლოდინში',
    'orders.status.contacted': 'დაკავშირებულია',
    'orders.status.confirmed': 'დადასტურებულია',
    'orders.status.arrived': 'ჩამოსულია',
    'orders.status.completed': 'დასრულებულია',
    'orders.status.cancelled': 'გაუქმებულია',

    // --- home --------------------------------------------------------------
    'home.hero.subtitle':
      'ხარისხიანი ავტოაქსესუარები, სანდო მომსახურებით. აღმოაჩინეთ პრემიუმ კლასის დეტალები თქვენი ავტომობილისთვის.',
    'home.about.eyebrow': 'ჩვენს შესახებ',
    'home.about.title': 'ავტოინდუსტრიის დახვეწილობა და უმაღლესი ხარისხი',
    'home.about.p1':
      'ჩვენ გთავაზობთ მხოლოდ საუკეთესო ხარისხის ავტონაწილებსა და აქსესუარებს, რომლებიც შერჩეულია განსაკუთრებული ყურადღებით.',
    'home.about.p2':
      'ჩვენი სერვისი მოიცავს სწრაფ მოძიებასა და მიწოდებას ქუთაისსა და მთელი საქართველოს მასშტაბით, რაც გიზოგავთ დროსა და ენერგიას.',
    // Followed in the markup by a WhatsApp link, hence the trailing space.
    'home.about.whatsapp':
      'სწრაფი და დეტალური პასუხისთვის კონკრეტული პროდუქტის შესახებ მომწერეთ ვაცაპზე',
    'home.faq.title': 'ხშირად დასმული კითხვები',
    'home.faq.q1': 'როგორ ხდება შეკვეთა?',
    'home.faq.a1':
      'შეკვეთის გაფორმება შეგიძლიათ როგორც საიტის, ასევე ჩვენი სოციალური ქსელების ან ტელეფონის საშუალებით. ჩვენი გუნდი დაგეხმარებათ სასურველი ნივთის შერჩევაში.',
    'home.faq.q2': 'რამდენ ხანში ჩამოვა ნივთი?',
    'home.faq.a2':
      'ადგილობრივი მარაგების შემთხვევაში მიწოდება ხდება 24 საათში. საზღვარგარეთიდან შეკვეთისას ტრანსპორტირების დრო ინდივიდუალურია და შეადგენს საშუალოდ 7-14 სამუშაო დღეს.',
    'home.faq.q3': 'როგორ დავუკავშირდე მაღაზიას?',
    'home.faq.a3':
      'ჩვენთან დაკავშირება შეგიძლიათ ნომერზე: 557 78 35 49, ან სოციალური ქსელების (FB, IG) მეშვეობით.',
    'home.faq.q4': 'შემიძლია თუ არა პროდუქტის დათვალიერება ონლაინ ჩატით?',
    'home.faq.a4':
      'დიახ, ჩვენ გთავაზობთ ვიდეო კონსულტაციას, სადაც დეტალურად გაჩვენებთ თქვენთვის სასურველი პროდუქტის ხარისხსა და მახასიათებლებს.',
  },

  en: {
    'brand.name': 'G&M Accessories',
    'common.loading': 'Loading...',
    'common.close': 'Close',
    'common.menu': 'Menu',
    'common.search': 'Search',
    'common.currency': '₾',
    'common.language': 'Language',

    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.favorites': 'Favorites',
    'nav.cart': 'Cart',
    'nav.orders': 'My orders',
    'nav.categories': 'Categories',

    'account.signIn': 'Sign in',
    'account.signOut': 'Sign out',
    'account.adminPanel': 'Admin panel',
    'account.myOrders': 'My orders',

    'auth.title': 'Sign in or register',
    'auth.subtitle': 'Choose one method — no password needed',
    'auth.continueGoogle': 'Continue with Google',
    'auth.continueFacebook': 'Continue with Facebook',
    'auth.consent': 'By continuing you agree to the',
    'auth.privacyPolicy': 'privacy policy',
    'auth.error.generic': 'Something went wrong. Please try again later.',
    'auth.error.rateLimit': 'Too many attempts in a short time. Please try again later.',
    'auth.error.providerDisabled': 'This sign-in method is temporarily unavailable.',

    'guard.signInRequired': 'Please sign in to continue',
    'guard.adminOnly': 'This page is for administrators only',

    'search.placeholder': 'Search products...',
    'search.noResults': 'No products found',

    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy policy',

    'price.from': 'from {amount}',

    'catalog.title': 'Catalog',
    'catalog.all': 'All',
    'catalog.category': 'Category',
    'catalog.sort': 'Sort',
    'catalog.sort.newest': 'Newest',
    'catalog.sort.priceAsc': 'Price: low to high',
    'catalog.sort.priceDesc': 'Price: high to low',
    'catalog.filter': 'Filter',
    'catalog.filter.price': 'Price (₾)',
    'catalog.filter.min': 'Min',
    'catalog.filter.max': 'Max',
    'catalog.filter.apply': 'Apply',
    'catalog.filter.clear': 'Clear',
    'catalog.empty': 'No products found',
    'catalog.prevPage': 'Previous page',
    'catalog.nextPage': 'Next page',
    'catalog.goToCatalog': 'Browse the catalog',
    'catalog.viewCatalog': 'View catalog',

    'product.addToCart': 'Add to cart',
    'product.added': 'Added',
    'product.size': 'Size:',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.watchVideo': 'Tap to watch the video',
    'product.addToFavorites': 'Add to favorites',
    'product.inFavorites': 'In favorites',
    'product.notFound': 'Product not found',
    'product.related': 'You might also like',
    'product.viewAll': 'View all',

    'favorites.title': 'Favorites',
    'favorites.empty': 'Your favorites list is empty',
    'favorites.remove': 'Remove from favorites',

    'cart.title': 'Cart',
    'cart.itemCount': '{count} item(s)',
    'cart.empty': 'Your cart is empty',
    'cart.summary': 'Summary',
    'cart.itemsTotal': 'Items total:',
    'cart.delivery': 'Delivery:',
    'cart.estimatedTotal': 'Estimated total:',
    'cart.fullName': 'Full name',
    'cart.fullNamePlaceholder': 'Enter your name...',
    'cart.phone': 'Phone number',
    'cart.notesPlaceholder': 'Note (optional)',
    'cart.submit': 'Place order request',
    'cart.submitting': 'Sending...',
    'cart.submitted': 'Sent',
    'cart.noOnlinePayment':
      'This is a purchase request — no payment is taken online. Our team will contact you to confirm the details.',
    'cart.error.missingContact': 'Please enter your name and phone number.',
    'cart.error.submitFailed': 'Could not send the order. Please try again.',
    'cart.success.title': 'Your order request has been sent',
    'cart.success.body':
      'Our team will contact you shortly. You can track the status on the "My orders" page.',
    'cart.success.viewOrders': 'View my orders',

    'orders.title': 'My orders',
    'orders.number': 'Order #{id}',
    'orders.total': 'Total',
    'orders.deletedProduct': 'Product deleted',
    'orders.empty': 'You have no orders yet',
    'orders.emptyHint': 'Send an order request from your cart and you will see its status here',
    'orders.status.pending': 'Pending',
    'orders.status.contacted': 'Contacted',
    'orders.status.confirmed': 'Confirmed',
    'orders.status.arrived': 'Arrived',
    'orders.status.completed': 'Completed',
    'orders.status.cancelled': 'Cancelled',

    'home.hero.subtitle':
      'Quality car accessories, backed by service you can rely on. Discover premium details for your vehicle.',
    'home.about.eyebrow': 'About us',
    'home.about.title': 'Automotive refinement and the highest quality',
    'home.about.p1':
      'We offer only the best quality car parts and accessories, each one selected with particular care.',
    'home.about.p2':
      'Our service covers fast sourcing and delivery in Kutaisi and throughout Georgia, saving you both time and effort.',
    'home.about.whatsapp':
      'For a fast, detailed answer about a specific product, message us on WhatsApp at',
    'home.faq.title': 'Frequently asked questions',
    'home.faq.q1': 'How do I place an order?',
    'home.faq.a1':
      'You can order through the website, through our social media channels, or by phone. Our team will help you choose the right item.',
    'home.faq.q2': 'How long does delivery take?',
    'home.faq.a2':
      'For items in local stock, delivery takes 24 hours. For orders from abroad the shipping time varies, averaging 7-14 working days.',
    'home.faq.q3': 'How do I contact the shop?',
    'home.faq.a3':
      'You can reach us on 557 78 35 49, or through our social media channels (FB, IG).',
    'home.faq.q4': 'Can I view a product over an online chat?',
    'home.faq.a4':
      'Yes — we offer a video consultation where we show you the quality and features of the product you are interested in, in detail.',
  },
}
