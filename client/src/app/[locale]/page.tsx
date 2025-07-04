import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ImageSwiper from '@/components/ImageSwiper';
import { BookOpen, CalendarDays, Gamepad, MessagesSquare, Tv, TvMinimalPlay } from 'lucide-react';

const categories = [
  { id: 8, name: 'Valorant', slug: 'valorant' },
  { id: 9, name: 'League of Legends', slug: 'league-of-legends' },
  { id: 10, name: 'Dota 2', slug: 'dota-2' },
  { id: 11, name: 'PUBG', slug: 'pubg' },
  { id: 1, name: 'CS2 Güncellemeleri', slug: 'cs2-guncelleme' },
  { id: 2, name: 'Stratejiler', slug: 'stratejiler' },
  { id: 3, name: 'Turnuvalar', slug: 'turnuvalar' },
  { id: 4, name: 'Aksesuarlar', slug: 'aksesuarlar' },
  { id: 5, name: 'Rehberler', slug: 'rehberler' },
  { id: 6, name: 'Topluluk', slug: 'topluluk' },
  { id: 7, name: 'Yarışmalar', slug: 'yarismalar' },
];

const trends = [
  { id: 1, title: 'CS2 gelecek turnuvalar', slug: 'cs2-gelecek-turnuvalar' },
  { id: 2, title: 'Yeni CS güncellemesi', slug: 'yeni-cs-guncellemesi' },
  { id: 3, title: 'Profesyonel taktikler', slug: 'profesyonel-taktikler' },
  { id: 4, title: 'Major turnuvası', slug: 'major-turnuvasi' },
  { id: 5, title: 'Yeni harita incelemesi', slug: 'yeni-harita-incelemesi' },
  { id: 6, title: 'CS2 aksesuarları', slug: 'cs2-aksesuarlar' },
  { id: 7, title: 'Topluluk etkinlikleri', slug: 'topluluk-etkinlikleri' },
  { id: 8, title: 'Yeni oyun modları', slug: 'yeni-oyun-modlari' },
];

const bigcategories = [
  {
    icon: <TvMinimalPlay className="w-16 h-16 text-orange-400" />,
    title: "Yayıncılar",
    subtitle: "Görüntüle",
    bgImage: "/images/a.png",
  },
  {
    icon: <Gamepad className="w-16 h-16 text-orange-400" />,
    title: "E-spor",
    subtitle: "Detaylar",
    bgImage: "/images/c.jpg",
  },
  {
    icon: <BookOpen className="w-16 h-16 text-orange-400" />,
    title: "Rehber",
    subtitle: "Keşfet",
    bgImage: "/images/d.jpg",
  },
  {
    title: "E-spor Oyuncuları",
    subtitle: "Takip Et",
    icon: <Tv className="w-16 h-16 text-orange-400" />,
    bgImage: "/images/b.jpg",
  },
  {
    title: "Söylentiler",
    subtitle: "İncele",
    icon: <MessagesSquare className="w-16 h-16 text-orange-400" />,
    bgImage: "/images/a.png",
  },
  {
    title: "Transfer Haberleri",
    subtitle: "Göz At",
    icon: <CalendarDays className="w-16 h-16 text-orange-400" />,
    bgImage: "/images/c.jpg",
  }
];

const posts = [
  {
    id: 1,
    title: "CS2 Güncellemesi Yayınlandı",
    excerpt: "Son CS2 güncellemesi ile oyun deneyiminizde neler değişti? Detaylar burada! Son CS2 güncellemesi ile oyun deneyiminizde neler değişti? Detaylar burada! Son CS2 güncellemesi ile oyun deneyiminizde neler değişti? Detaylar burada!",
    image: "https://picsum.photos/400/200?random=1",
  },
  {
    id: 2,
    title: "Turnuva Takvimi Açıklandı",
    excerpt: "2025 sezonu turnuva tarihleri ve önemli etkinlikler bu yazıda. 2025 sezonu turnuva tarihleri ve önemli etkinlikler bu yazıda. 2025 sezonu turnuva tarihleri ve önemli etkinlikler bu yazıda. 2025 sezonu turnuva tarihleri ve önemli etkinlikler bu yazıda. 2025 sezonu turnuva tarihleri ve önemli etkinlikler bu yazıda.",
    image: "https://picsum.photos/400/200?random=2",
  },
  {
    id: 3,
    title: "Profesyonel Oyunculardan Taktikler",
    excerpt: "E-spor dünyasının en iyilerinden oyun içi strateji önerileri. E-spor dünyasının en iyilerinden oyun içi strateji önerileri. E-spor dünyasının en iyilerinden oyun içi strateji önerileri. E-spor dünyasının en iyilerinden oyun içi strateji önerileri. E-spor dünyasının en iyilerinden oyun içi strateji önerileri.",
    image: "https://picsum.photos/400/200?random=3",
  },
  {
    id: 4,
    title: "Yeni Yayıncılar Listesi",
    excerpt: "Takip etmen gereken yeni yayıncılar ve içerik üreticileri. Takip etmen gereken yeni yayıncılar ve içerik üreticileri. Takip etmen gereken yeni yayıncılar ve içerik üreticileri. Takip etmen gereken yeni yayıncılar ve içerik üreticileri.",
    image: "https://picsum.photos/400/200?random=4",
  },
  {
    id: 5,
    title: "E-spor Dünyasında Son Trendler",
    excerpt: "Popüler oyunlar, yeni ekipmanlar ve daha fazlası. Popüler oyunlar, yeni ekipmanlar ve daha fazlası. Popüler oyunlar, yeni ekipmanlar ve daha fazlası. Popüler oyunlar, yeni ekipmanlar ve daha fazlası. Popüler oyunlar, yeni ekipmanlar ve daha fazlası.",
    image: "https://picsum.photos/400/200?random=5",
  },
  {
    id: 6,
    title: "Rehber: Başlangıç İçin İpuçları",
    excerpt: "Yeni başlayanlar için temel rehber ve oyun önerileri. Yeni başlayanlar için temel rehber ve oyun önerileri. Yeni başlayanlar için temel rehber ve oyun önerileri. Yeni başlayanlar için temel rehber ve oyun önerileri. Yeni başlayanlar için temel rehber ve oyun önerileri.",
    image: "https://picsum.photos/400/200?random=6",
  },
];



export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div className='max-w-screen-2xl mx-auto'>
      <ImageSwiper />
      <div className="grid grid-cols-7 gap-6 mt-12">
        {/* Sol taraf (2/3) - Bloglar */}
        <div className="col-span-5 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            {/* Soldaki kısa çizgi */}
            <div className="w-8 h-px bg-orange-600"></div>

            {/* Başlıklar */}
            <p className="font-semibold text-4xl uppercase whitespace-nowrap text-orange-600">
              Son
            </p>
            <p className="font-semibold text-4xl uppercase whitespace-nowrap text-gray-900">
              Gönderiler
            </p>

            {/* Sağdaki uzun çizgi */}
            <div className="flex-grow h-px bg-orange-600 opacity-50 ml-4"></div>
          </div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 w-full">
              <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                <img
                  alt="blog"
                  src={`https://dummyimage.com/206x206&text=Blog+${i}`}
                  className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4"
                />
                <div className="flex-grow sm:pl-8">
                  <h2 className="title-font font-medium text-lg text-gray-900">Blog Başlığı {i}</h2>
                  <h3 className="text-gray-500 mb-3">Yazar İsmi</h3>
                  <div className='flex items-center justify-between'>
                    <span className="flex items-center gap-2 text-gray-500 text-sm">
                      <CalendarDays /> 01.01.2023
                    </span>
                    <span className="flex items-center gap-2 text-gray-500 text-sm">
                      <MessagesSquare /> 0
                    </span>
                  </div>
                  <p className="my-4 line-clamp-3">
                    Bu blogun kısa özeti burada yer alır. Detaylar için okumaya devam edin...Bu blogun kısa özeti burada yer alır. Detaylar için okumaya devam edin...Bu blogun kısa özeti burada yer alır. Detaylar için okumaya devam edin...Bu blogun kısa özeti burada yer alır. Detaylar için okumaya devam edin...Bu blogun kısa özeti burada yer alır. Detaylar için okumaya devam edin...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sağ taraf (1/3) - Yan içerik */}
        <div className="col-span-2 space-y-4">
          <div className="py-4 pl-4 bg-gray-800 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="font-semibold text-xl text-orange-600 uppercase whitespace-nowrap">
                Trend
              </h3>
              <h3 className="font-semibold text-xl text-white uppercase whitespace-nowrap">
                İçerikler
              </h3>
              <div className="flex-grow h-px bg-white opacity-50"></div>
            </div>

            <ul className="space-y-1 text-white list-disc pl-5 text-sm">
              {trends.map((trend) => (
                <li key={trend.id}>
                  <Link
                    href={`/kategori/${trend.slug}`}
                    className="hover:text-orange-400 transition"
                  >
                    {trend.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 rounded-lg shadow relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Yeni CS2 Aksesuarları!</h3>
              <p className="text-sm text-gray-700 mb-4">
                Oyununuz kadar tarzınız da güçlü olsun. %25 indirim fırsatını kaçırmayın!
              </p>
              <button className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-orange-600 transition">
                Hemen İncele
              </button>
            </div>
            {/* Temsili görsel arka plan */}
            <div className="absolute top-0 right-0 w-full h-full opacity-20">
              <img
                src="/images/b.jpg"
                alt="banner"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          <div className="py-4 pl-4 bg-gray-800 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-semibold text-xl text-orange-600 uppercase whitespace-nowrap">
                İçerik
              </h3>
              <h3 className="font-semibold text-xl text-white uppercase whitespace-nowrap">
                Kategorileri
              </h3>
              <div className="flex-grow h-px bg-white opacity-50"></div>
            </div>

            <ul className="space-y-1 text-white list-disc pl-5 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="hover:text-orange-400 transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className='space-y-6 mt-12'>
        <div className="flex items-center gap-2 mb-4">
          {/* Soldaki kısa çizgi */}
          <div className="w-8 h-px bg-orange-600"></div>

          {/* Başlıklar */}
          <p className="font-semibold text-4xl uppercase whitespace-nowrap text-orange-600">
            Öne Çıkan
          </p>
          <p className="font-semibold text-4xl uppercase whitespace-nowrap text-gray-900">
            Kategoriler
          </p>

          {/* Sağdaki uzun çizgi */}
          <div className="flex-grow h-px bg-orange-600 opacity-50 ml-4"></div>
        </div>
        <div className="mt-12 p-6 w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
          {bigcategories.map(({ icon, title, subtitle, bgImage }, i) => (
            <div
              key={i}
              className="relative h-40 flex items-center justify-center gap-4 rounded-lg p-4 shadow cursor-pointer overflow-hidden group"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-70 transition"></div>

              {/* İçerik */}
              <div className="relative flex items-center gap-4 z-10">
                <div>{icon}</div>
                <div className="flex flex-col">
                  <span className="text-3xl font-semibold text-white">{title}</span>
                  <span className="text-lg text-orange-400">{subtitle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      <div className='space-y-6 mt-12'>
        <div className="flex items-center gap-2 mb-4">
          {/* Soldaki kısa çizgi */}
          <div className="w-8 h-px bg-orange-600"></div>

          {/* Başlıklar */}
          <p className="font-semibold text-4xl uppercase whitespace-nowrap text-orange-600">
            Tüm
          </p>
          <p className="font-semibold text-4xl uppercase whitespace-nowrap text-gray-900">
            Gönderiler
          </p>

          {/* Sağdaki uzun çizgi */}
          <div className="flex-grow h-px bg-orange-600 opacity-50 ml-4"></div>
        </div>
          <div className="mt-12 p-6 w-full grid grid-cols-1 sm:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article
          key={post.id}
          className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg isolate bg-gray-900 h-64"
        >
          {/* Arka plan resmi */}
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover -z-10 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Karartma overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent -z-10 rounded-xl"></div>

          {/* Alt içerik container */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 bg-gradient-to-t from-gray-900/90 to-transparent rounded-b-xl flex flex-col">
            {/* Başlık */}
            <h3
              className="text-white text-xl font-semibold leading-tight transition-transform duration-500 group-hover:-translate-y-6"
            >
              {post.title}
            </h3>

            {/* Tarih ve link (başta gizli, hover’da görünür) */}
            <div
              className="flex items-center justify-between mt-1 opacity-0 max-h-0 overflow-hidden transition-all duration-500 group-hover:opacity-100 group-hover:max-h-10"
              style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              <time className="text-gray-300 text-sm select-none" dateTime="2023-01-01">
                01.01.2023
              </time>
              <Link
                href={`/post/${post.id}`}
                className="text-teal-400 hover:text-teal-200 font-medium text-sm transition"
              >
                Devamını Oku →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
      </div>

      {/* <h1>{t('title')}</h1>
      <Link href="/about">{t('about')}</Link> */}
    </div>
  );
}