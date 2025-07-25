import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ImageSwiper from '@/components/ImageSwiper';
import { BookOpen, CalendarDays, Gamepad, MessagesSquare, Tv, TvMinimalPlay } from 'lucide-react';
import Title from '@/components/Title';
import BlogCard from '@/components/BlogCard';

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

const gameDataByType = {
  "Counter Strike 2": {
    teams: [
      {
        name: "Vitality",
        logo: "https://img-cdn.hltv.org/teamlogo/yeXBldn9w8LZCgdElAenPs.png?ixlib=java-2.1.0&w=50&s=15eaba0b75250065d20162d2cb05e3e6",
        rank: "Ranking 1",
        country: "EU",
        players: [
          { image: "https://picsum.photos/400/200?random=1", name: "Player 1", role: "AWP", country: "FR" },
          { image: "https://picsum.photos/400/200?random=2", name: "Player 2", role: "IGL", country: "FR" },
          { image: "https://picsum.photos/400/200?random=3", name: "Player 3", role: "Rifler", country: "FR" },
          { image: "https://picsum.photos/400/200?random=4", name: "Player 4", role: "Support", country: "FR" },
          { image: "https://picsum.photos/400/200?random=5", name: "Player 5", role: "Entry", country: "FR" },
        ],
      },
      {
        name: "Aurora",
        logo: "https://img-cdn.hltv.org/teamlogo/yJzPNOeXlyiniNxanYJCrv.png?ixlib=java-2.1.0&w=50&s=2c08f70c2f2f8c2024a438ddcf19bbf1",
        rank: "Ranking 5",
        country: "TR",
        players: [
          { image: "https://img-cdn.hltv.org/playerbodyshot/FOrUruleFFTDLRcrR40yCE.png?ixlib=java-2.1.0&w=400&s=bb1ddc04f4752f448f6bfb76ae19ce5f", name: "Maj3r", role: "AWP", country: "TR" },
          { image: "https://picsum.photos/400/200?random=7", name: "Xantares", role: "IGL", country: "TR" },
          { image: "https://picsum.photos/400/200?random=8", name: "Woxic", role: "Rifler", country: "TR" },
          { image: "https://picsum.photos/400/200?random=9", name: "Wicadia", role: "Support", country: "TR" },
          { image: "https://picsum.photos/400/200?random=10", name: "jottAAA", role: "Entry", country: "TR" },
        ],
      },
      {
        name: "Team C",
        logo: "https://picsum.photos/400/200?random=3",
        rank: "Top 3",
        country: "EU",
        players: [
          { image: "https://picsum.photos/400/200?random=11", name: "Player 11", role: "AWP", country: "EU" },
          { image: "https://picsum.photos/400/200?random=12", name: "Player 12", role: "IGL", country: "EU" },
          { image: "https://picsum.photos/400/200?random=13", name: "Player 13", role: "Rifler", country: "EU" },
          { image: "https://picsum.photos/400/200?random=14", name: "Player 14", role: "Support", country: "EU" },
          { image: "https://picsum.photos/400/200?random=15", name: "Player 15", role: "Entry", country: "EU" },
        ],
      },
      {
        name: "Team D",
        logo: "https://picsum.photos/400/200?random=4",
        rank: "Top 10",
        country: "TR",
        players: [
          { image: "https://picsum.photos/400/200?random=16", name: "Player 16", role: "DPS", country: "TR" },
          { image: "https://picsum.photos/400/200?random=17", name: "Player 17", role: "Tank", country: "TR" },
          { image: "https://picsum.photos/400/200?random=18", name: "Player 18", role: "Support", country: "TR" },
          { image: "https://picsum.photos/400/200?random=19", name: "Player 19", role: "DPS", country: "TR" },
          { image: "https://picsum.photos/400/200?random=20", name: "Player 20", role: "Tank", country: "TR" },
        ],
      },
      {
        name: "Team E",
        logo: "https://picsum.photos/400/200?random=5",
        rank: "Top 10",
        country: "TR",
        players: [
          { image: "https://picsum.photos/400/200?random=21", name: "Player 21", role: "DPS", country: "TR" },
          { image: "https://picsum.photos/400/200?random=22", name: "Player 22", role: "Tank", country: "TR" },
          { image: "https://picsum.photos/400/200?random=23", name: "Player 23", role: "Support", country: "TR" },
          { image: "https://picsum.photos/400/200?random=24", name: "Player 24", role: "DPS", country: "TR" },
          { image: "https://picsum.photos/400/200?random=25", name: "Player 25", role: "Tank", country: "TR" },
        ],
      },
      {
        name: "Team F",
        logo: "https://picsum.photos/400/200?random=6",
        rank: "Top 10",
        country: "TR",
        players: [
          { image: "https://picsum.photos/400/200?random=26", name: "Player 26", role: "DPS", country: "TR" },
          { image: "https://picsum.photos/400/200?random=27", name: "Player 27", role: "Tank", country: "TR" },
          { image: "https://picsum.photos/400/200?random=28", name: "Player 28", role: "Support", country: "TR" },
          { image: "https://picsum.photos/400/200?random=29", name: "Player 29", role: "DPS", country: "TR" },
          { image: "https://picsum.photos/400/200?random=30", name: "Player 30", role: "Tank", country: "TR" },
        ],
      }
    ],
  },
  "Valorant": {
    teams: [
      {
        name: "Team X",
        logo: "https://picsum.photos/400/200?random=4",
        rank: "Top 10",
        country: "TR",
        players: [
          { image: "https://picsum.photos/400/200?random=16", name: "Player 16", role: "DPS", country: "TR" },
          { image: "https://picsum.photos/400/200?random=17", name: "Player 17", role: "Tank", country: "TR" },
          { image: "https://picsum.photos/400/200?random=18", name: "Player 18", role: "Support", country: "TR" },
          { image: "https://picsum.photos/400/200?random=19", name: "Player 19", role: "DPS", country: "TR" },
          { image: "https://picsum.photos/400/200?random=20", name: "Player 20", role: "Tank", country: "TR" },
        ],
      },
    ],
  },
  "League of Legends": {
    teams: [
      {
        name: "Team Y",
        logo: "https://picsum.photos/400/200?random=5",
        rank: "Top 10",
        country: "TR",
        players: [
          { image: "https://picsum.photos/400/200?random=21", name: "Player 21", role: "DPS", country: "TR" },
          { image: "https://picsum.photos/400/200?random=22", name: "Player 22", role: "Tank", country: "TR" },
          { image: "https://picsum.photos/400/200?random=23", name: "Player 23", role: "Support", country: "TR" },
          { image: "https://picsum.photos/400/200?random=24", name: "Player 24", role: "DPS", country: "TR" },
          { image: "https://picsum.photos/400/200?random=25", name: "Player 25", role: "Tank", country: "TR" },
        ],
      },
    ],
  },
};

const posts = [
  {
    id: 1,
    title: "CS2 Güncellemesi Yayınlandı",
    excerpt: "Son CS2 güncellemesi ile oyun deneyiminizde neler değişti? Detaylar burada! Son CS2 güncellemesi ile oyun deneyiminizde neler değişti? Detaylar burada! Son CS2 güncellemesi ile oyun deneyiminizde neler değişti? Detaylar burada!",
    image: "https://picsum.photos/400/200?random=1",
    date: "2025-07-01",
  },
  {
    id: 2,
    title: "Turnuva Takvimi Açıklandı",
    excerpt: "2025 sezonu turnuva tarihleri ve önemli etkinlikler bu yazıda. 2025 sezonu turnuva tarihleri ve önemli etkinlikler bu yazıda. 2025 sezonu turnuva tarihleri ve önemli etkinlikler bu yazıda. 2025 sezonu turnuva tarihleri ve önemli etkinlikler bu yazıda. 2025 sezonu turnuva tarihleri ve önemli etkinlikler bu yazıda.",
    image: "https://picsum.photos/400/200?random=2",
    date: "2025-07-02",
  },
  {
    id: 3,
    title: "Profesyonel Oyunculardan Taktikler",
    excerpt: "E-spor dünyasının en iyilerinden oyun içi strateji önerileri. E-spor dünyasının en iyilerinden oyun içi strateji önerileri. E-spor dünyasının en iyilerinden oyun içi strateji önerileri. E-spor dünyasının en iyilerinden oyun içi strateji önerileri. E-spor dünyasının en iyilerinden oyun içi strateji önerileri.",
    image: "https://picsum.photos/400/200?random=3",
    date: "2025-07-03",
  },
  {
    id: 4,
    title: "Yeni Yayıncılar Listesi",
    excerpt: "Takip etmen gereken yeni yayıncılar ve içerik üreticileri. Takip etmen gereken yeni yayıncılar ve içerik üreticileri. Takip etmen gereken yeni yayıncılar ve içerik üreticileri. Takip etmen gereken yeni yayıncılar ve içerik üreticileri.",
    image: "https://picsum.photos/400/200?random=4",
    date: "2025-07-04",
  },
  {
    id: 5,
    title: "E-spor Dünyasında Son Trendler",
    excerpt: "Popüler oyunlar, yeni ekipmanlar ve daha fazlası. Popüler oyunlar, yeni ekipmanlar ve daha fazlası. Popüler oyunlar, yeni ekipmanlar ve daha fazlası. Popüler oyunlar, yeni ekipmanlar ve daha fazlası. Popüler oyunlar, yeni ekipmanlar ve daha fazlası.",
    image: "https://picsum.photos/400/200?random=5",
    date: "2025-07-05",
  },
  {
    id: 6,
    title: "Rehber: Başlangıç İçin İpuçları",
    excerpt: "Yeni başlayanlar için temel rehber ve oyun önerileri. Yeni başlayanlar için temel rehber ve oyun önerileri. Yeni başlayanlar için temel rehber ve oyun önerileri. Yeni başlayanlar için temel rehber ve oyun önerileri. Yeni başlayanlar için temel rehber ve oyun önerileri.",
    image: "https://picsum.photos/400/200?random=6",
    date: "2025-07-06",
  },
];

const upcomingMatches = [
  {
    id: 1,
    teamA: { name: "PlayForGG", logo: "https://img-cdn.hltv.org/teamlogo/yeXBldn9w8LZCgdElAenPs.png?ixlib=java-2.1.0&w=50&s=15eaba0b75250065d20162d2cb05e3e6" },
    teamB: { name: "Team Hydra", logo: "https://img-cdn.hltv.org/teamlogo/IejtXpquZnE8KqYPB1LNKw.svg?ixlib=java-2.1.0&s=7fd33b8def053fbfd8fdbb58e3bdcd3c" },
    date: "07.07.2025",
    time: "20:30",
    tournament: "CS2 Türkiye Ligi",
    streams: {
      twitch: "https://twitch.tv/playforgg",
      youtube: "https://youtube.com/@playforgg",
    },
  },
  {
    id: 2,
    teamA: { name: "ValoKings", logo: "https://owcdn.net/img/628ccb7095263.png" },
    teamB: { name: "Ghost Five", logo: "https://www.vlr.gg/img/vlr/tmp/vlr.png" },
    date: "08.07.2025",
    time: "19:00",
    tournament: "Valorant Pro Series",
    streams: {
      twitch: "https://twitch.tv/valokingsofficial",
      kick: "https://kick.com/valolive",
    },
  },
  {
    id: 3,
    teamA: { name: "LoL Titans", logo: "https://am-a.akamaihd.net/image?resize=48:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png" },
    teamB: { name: "Blue Nexus", logo: "https://am-a.akamaihd.net/image?resize=48:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1726801573959_539px-T1_2019_full_allmode.png" },
    date: "09.07.2025",
    time: "21:45",
    tournament: "LoL Worlds Qualifier",
    streams: {
      youtube: "https://youtube.com/@lolworlds",
    },
  },
];

const allGames = [
  {
    id: 1,
    title: 'Cyber Warfare Güncellemesi - FPS Aksiyon Oyunu - 2024 Yaz Dönemi',
    category: 'Aksiyon',
    image: 'https://picsum.photos/400/200?random=1',
    description: 'Yüksek tempolu FPS aksiyon oyunu. Hızlı refleksler ve strateji gerektirir. aksiyon dolu savaşlar seni bekliyor! fight for survival in a dystopian future. wage war against rogue AI and cybernetic enemies. join the resistance and fight for humanity\'s future.',
  },
  {
    id: 2,
    title: 'Kingdom Saga',
    category: 'RPG',
    image: 'https://picsum.photos/400/200?random=2',
    description: 'Derin hikayesiyle RPG deneyimi.',
  },
  {
    id: 3,
    title: 'War Tactics',
    category: 'Strateji',
    image: 'https://picsum.photos/400/200?random=3',
    description: 'Gerçek zamanlı strateji savaşları.',
  },
  {
    id: 4,
    title: 'Dark Realms',
    category: 'RPG',
    image: 'https://picsum.photos/400/200?random=4',
    description: 'Gotik dünyada karakter geliştirme.',
  },
  {
    id: 5,
    title: 'Bullet Rush',
    category: 'Aksiyon',
    image: 'https://picsum.photos/400/200?random=5',
    description: 'Reflekslerini konuştur!',
  },
];

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div className='max-w-screen-2xl mx-auto'>
      <ImageSwiper />
      <div className='space-y-6 mt-12'>
        <Title title1={"Öne Çıkan"} title2={'Kategoriler'} />
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
        <Title title1={"Son"} title2={'gönderiler'} />
        <div className="grid grid-cols-7 gap-6">
          {/* Sol taraf (2/3) - Bloglar */}
          <div className="col-span-5 space-y-6">
            {[1, 2, 3].map((i) => (
              <div className="w-full" key={i}>
                <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left p-4
                  bg-[#111827] rounded-lg shadow-lg border border-[#1f2937]">

                  <img
                    alt="blog"
                    src={`https://dummyimage.com/206x206&text=Blog+${i}`}
                    className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4"
                  />
                  <div className="flex-grow sm:pl-8">
                    <h2 className="title-font font-medium text-lg text-white">Blog Başlığı {i}</h2>
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
                  Forumlar
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
      </div>

      {/* <div className='space-y-6 mt-12'>
        <Title title1={"Yaklaşan"} title2={'Maçlar'} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {upcomingMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div> */}
      <div className='space-y-6 mt-12'>
        <Title title1={"Tüm"} title2={'Bloglar'} />
        <div className="mt-12 p-6 w-full grid grid-cols-1 sm:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
      {/* <div className="space-y-6 mt-12">
        <Title title1={"E-spor"} title2={'Takımları'} />
        {Object.entries(gameDataByType).map(([game, data]) => {
          const visibleTeams = data.teams.slice(0, 3);
          const hasMore = data.teams.length > 3;

          return (
            <div key={game} className="space-y-4">
              <h3 className="text-2xl font-semibold text-white border-l-4 border-orange-500 pl-3 bg-gray-800 py-2">
                {game}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleTeams.map((team) => (
                  <div
                    key={team.name}
                    className="relative bg-gray-900 text-white rounded-lg shadow-md p-4 overflow-hidden flex flex-col gap-3"
                  >
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="absolute top-2 left-2  h-32 opacity-10 object-contain pointer-events-none"
                    />

                    <div className="relative z-10">
                      <h4 className="text-base font-semibold">{team.name}</h4>
                      <p className="text-xs text-gray-400">{team.country} • {team.rank}</p>
                    </div>
                    <div className="relative z-10 flex flex-col gap-1">
                      {team.players.map((player) => (
                        <div
                          key={player.name}
                          className="flex items-center justify-between text-sm text-gray-300"
                        >
                          <div className="flex flex-col ">
                            <span className=" max-w-[120px]">{player.name}</span>
                            <span className="text-xs text-gray-500">{player.role}</span>
                          </div>
                          <span className="text-xs text-gray-500">{player.country}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <div className="bg-gray-100 border-2 border-dashed border-orange-400 rounded-lg shadow-md p-4 flex items-center justify-center text-center hover:bg-orange-50 transition cursor-pointer">
                    <span className="text-orange-600 font-semibold text-sm">Hepsini Gör →</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div> */}
      <div className='space-y-6 mt-12'>
        <Title title1={"Oyun"} title2={'İçerikleri'} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6">
          {allGames.map((game) => (
            <a href={`/games/${game.id}`} key={game.id} className="group">
              <div
                className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg isolate bg-gray-900 h-96 w-80 transition-transform duration-500 hover:scale-105"
              >
                {/* Arka plan resmi */}
                <img
                  src={game.image}
                  alt={game.title}
                  className="absolute inset-0 w-full h-full object-cover -z-10 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Karartma overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent -z-10 rounded-xl"></div>

                {/* Kategori etiketi */}
                <span className="absolute top-5 right-5 bg-orange-600 text-white text-sm font-semibold px-3 py-1 rounded-full z-10">
                  {game.category}
                </span>

                {/* Alt içerik container */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 bg-gradient-to-t from-gray-900/90 to-transparent rounded-b-xl flex flex-col">
                  {/* Başlık */}
                  <h3 className="text-white text-xl font-semibold leading-tight transition-transform duration-500 group-hover:-translate-y-2 line-clamp-3">
                    {game.title}
                  </h3>

                  {/* Açıklama */}
                  <div
                    className="mt-2 text-gray-300 text-sm opacity-0 max-h-0 overflow-hidden transition-all duration-500 group-hover:opacity-100 group-hover:max-h-28 line-clamp-4"
                    style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
                  >
                    {game.description}
                  </div>
                </div>
              </div>
            </a>
          ))}
          {allGames.length === 0 && (
            <p className="text-gray-500 col-span-full">Bu kategoride oyun bulunamadı.</p>
          )}
        </div>
      </div>
      <div className="space-y-6 mt-12">
        <Title title1={"Topluluk"} title2={'İçeriği'} />

        {/* Topluluk İçeriği */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kart 1: Forum */}
          <div className="bg-[#111827] rounded-xl shadow-md p-6 hover:shadow-lg transition border border-white/10">
            <h4 className="text-lg font-bold text-white mb-2">🎯 Forum Tartışmaları</h4>
            <p className="text-sm text-gray-400 mb-4">
              Oyunlarla ilgili strateji paylaşın, turnuvaları değerlendirin, fikirlerinizi yazın.
            </p>
            <a href="/forum" className="text-orange-500 font-semibold text-sm hover:underline">
              Foruma Git →
            </a>
          </div>

          {/* Kart 2: Discord */}
          <div className="bg-[#111827] rounded-xl shadow-md p-6 hover:shadow-lg transition border border-white/10">
            <h4 className="text-lg font-bold text-white mb-2">💬 Discord Sunucusu</h4>
            <p className="text-sm text-gray-400 mb-4">
              Sohbet et, yeni oyuncularla tanış, etkinlikleri kaçırma. Aktif topluluk seni bekliyor.
            </p>
            <a href="https://discord.gg/yourserver" target="_blank" className="text-orange-500 font-semibold text-sm hover:underline">
              Discord'a Katıl →
            </a>
          </div>

          {/* Kart 3: Paylaşımlar */}
          <div className="bg-[#111827] rounded-xl shadow-md p-6 hover:shadow-lg transition border border-white/10">
            <h4 className="text-lg font-bold text-white mb-2">📸 Oyuncu Paylaşımları</h4>
            <p className="text-sm text-gray-400 mb-4">
              Ekran görüntüleri, zafer anları, komik anlar... Gönder ve paylaş!
            </p>
            <a href="/paylasimlar" className="text-orange-500 font-semibold text-sm hover:underline">
              Paylaşımları Gör →
            </a>
          </div>
        </div>

      </div>

      {/* <h1>{t('title')}</h1>
      <Link href="/about">{t('about')}</Link> */}
    </div>
  );
}