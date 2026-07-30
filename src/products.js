// Demo catalog — only these three products exist.
export const PRODUCTS = [
  {
    id: 1,
    title: "ტყავის საჭის შალითა",
    subtitle: "ინტერიერი / Premium Selection",
    price: 120,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLvVML8GtYv7jCyRtLB9xBCLZ2d0EMqCgHp38foK5TPUuMZYnHkYuUmuhR5y9BkqUX_p9KYAmBwHA5EeqizGaoI5mAO1yIe_Fn6oVTTbI8QfeWYLnX6DRwLH6mEfS3QGb97gpKXtjTbUu4r4qnl2om-46FovXnUnqNAN82XnZsbEN_7CQNgK4qMBW-_CJQDfdGBD6YSBOrejg7ygLRi0s3KnYVDejjKoAiRIr3ZjeTt6eDGOK29HwN8g",
  },
  {
    id: 2,
    title: "კარბონის გადაცემათა კოლოფი",
    subtitle: "ინტერიერი / Carbon Series",
    price: 85,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoxrKDed4iz49eJhbpT66N81Nxc6NCGj9Ra5yqKs2b7Ox2LW5E9M0rb8jmFd5TRHRqUKjv7qPe_E3JPPGc-eEnBqnLsTzqfjv1UyPSOckRvvUG9E_ZqbHzFB3kFIHRLLmeEVn54CtK3-x2HR5TpVsBe7Tk9aklG_eFSypeRzF6cL8bS8QWxA3BgDMwbs9yxAKqF-kG7U0U1mi-sBtj_PYOrJCSIJKE-FJcyexDv1atEi5mNT7v5DO0_g",
  },
  {
    id: 3,
    title: "LED განათების ნაკრები",
    subtitle: "ელექტრონიკა / Atmosphere",
    price: 150,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9hJBy5xJNta9xe8bLHUwPPzmA7ms9kJ7084qnIAMiQbrtQcsrJg7jhW7hMRPh3WKDQrYNdOvUadyhoF4oCA5oLQuSkzTkPM7qOoslU4nUxgMX62W3DdC3yQgOLCfBDEAxy0iLGw3OxdNANzCFuwrWxAv-9lHMW1lBUREsnOeBHci8g3rJx3_LebLm-097tFBLc5wQntPx-zTHqn5aY9LH4NapWsAhCQSd6arOHulQVcIzrSguNKzBjg",
  },
]

// Featured product shown on the product-detail page.
export const CARBON_NIGHT = {
  id: "carbon-night",
  title: 'პრემიუმ ტყავის საჭის ჩიხოლი "Carbon Night"',
  subtitle: "Limited Edition",
  price: 245,
  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsiiksJIKFoiQU_qcjEaf3P92Nhwk1f0ndlNFu5rkFwuVKp4-vImHmubcdgZqiFPiwoVStGBjQd_bFLSdqhF57WyvIJTX4rwfcn2l6i94UfXhKjtNTt2hPvugoKuFZP5V0O5OlvCtu6Se1xoy5caPj6NYq4B-buow6fWmX91BRTxcT3G-OX0qUyhiqfobWnG3OmSYZHejTLIUwTlmpn00ODbWdhRt_XitsNUAaitl-IartaPe4GuIlpg",
}

export const fmt = (n) => `${Number(n).toFixed(2)} ₾`
