
// canlı yayın platformalrı 
 {/* 
   const live = [
  {
    id: 1,
    title: "Twitch",
    bgImage: "https://cdn.m7g.twitch.tv/ba46b4e5e395b11efd34/assets/uploads/generic-email-header-1.jpg?w=1200&h=630&fm=jpg&auto=format",
  },
  {
    id: 2,
    title: "YouTube",
    bgImage: "https://1000logos.net/wp-content/uploads/2017/05/Youtube-Logo.png",
  },
  {
    id: 3,
    title: "Kick",
    bgImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Kick.com_icon_logo.svg/2048px-Kick.com_icon_logo.svg.png",
  }

];
  <div className='space-y-6 mt-12'>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-px bg-orange-600"></div>
          <p className="font-semibold text-4xl uppercase whitespace-nowrap text-orange-600">
            Yayıncı
          </p>
          <p className="font-semibold text-4xl uppercase whitespace-nowrap text-gray-900">
            Platformları
          </p>
          <div className="flex-grow h-px bg-orange-600 opacity-50 ml-4"></div>
        </div>
      <div className="mt-12 p-6 w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
          {live.map(({ title, bgImage }, i) => (
            <div
              key={i}
              className="relative h-40 flex items-center justify-center gap-4 rounded-lg p-4 shadow cursor-pointer overflow-hidden group"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition"></div>
            </div>
          ))}
        </div> 
      </div> */}


// takımlar kart yapısı 
//  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {visibleTeams.map((team) => (
//                   <div
//                     key={team.name}
//                     className="bg-gray-900 text-white rounded-xl shadow-lg p-5 flex flex-col"
//                   >
//                     {/* Logo + Başlık */}
//                     <div className="flex items-center gap-4 mb-4">
//                       <img
//                         src={team.logo}
//                         alt={team.name}
//                         className="w-16 h-16 object-contain rounded p-1"
//                       />
//                       <div>
//                         <h4 className="text-xl font-bold">{team.name}</h4>
//                         <p className="text-sm text-gray-400">
//                           {team.country} • {team.rank}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Oyuncular */}
//                     <div className="grid grid-cols-1 gap-2 mt-auto">
//                       {team.players.map((player) => (
//                         <div
//                           key={player.name}
//                           className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-md"
//                         >
//                           {/* <img
//                             src={player.image}
//                             alt={player.name}
//                             className="w-16 h-16  object-cover border-b border-gray-600"
//                           /> */}
//                           <div>
//                             <p className="text-sm font-medium uppercase">{player.name}</p>
//                             <p className="text-xs text-gray-400">{player.role}</p>
//                           </div>
//                           <span className="text-xs text-gray-500 ml-auto">{player.country}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}

//                 {/* Hepsini Gör Kartı */}
//                 {hasMore && (
//                   <div className="bg-gray-100 border-2 border-dashed border-orange-400 rounded-xl shadow-lg p-5 flex items-center justify-center text-center hover:bg-orange-50 transition cursor-pointer">
//                     <span className="text-orange-600 font-semibold text-lg">Hepsini Gör →</span>
//                   </div>
//                 )}
//               </div>


// articles kalkan sayfa
// 'use client';
// import React, { useEffect, useState, useCallback } from 'react';
// import Title from '@/components/Title';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Article } from '@/customServices/articles.service';
// import Cookies from 'js-cookie';
// import { MessageSquare } from 'lucide-react';

// const fakeComments = [
//     { author: 'Fatma G.', text: 'Oyun içi değişiklikler hakkında daha fazla bilgi istiyorum.' },
// ];

// interface Props {
//     initialData: {
//         data: Article[];
//         status: boolean;
//         meta: {
//             current_page: number;
//             last_page: number;
//             per_page: number;
//             total: number;
//         };
//     };
// }

// function ToggleableContent({ content }: { content: string }) {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const isLong = content.length > 180;

//     return (
//         <div>
//             <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
//                 {isExpanded || !isLong ? content : `${content.slice(0, 180)}...`}
//             </p>
//             {isLong && (
//                 <button
//                     onClick={() => setIsExpanded(!isExpanded)}
//                     className="text-xs text-blue-600 dark:text-blue-400 mt-1"
//                 >
//                     {isExpanded ? 'Daha az göster' : 'Devamını oku'}
//                 </button>
//             )}
//         </div>
//     );
// }

// const ArticlesPage: React.FC<Props> = ({ initialData }) => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const slug = searchParams.get('haber');

//     const [articles, setArticles] = useState<Article[]>(initialData.data || []);
//     const [page, setPage] = useState(initialData.meta.current_page);
//     const [lastPage, setLastPage] = useState(initialData.meta.last_page);
//     const [loading, setLoading] = useState(false);

//     const selectedNews = articles.find((n) => n.slug === slug);

//     const loadMore = useCallback(async () => {
//         if (loading || page >= lastPage) return;
//         setLoading(true);
//         const locale = Cookies.get("NEXT_LOCALE") || "tr";
//         try {
//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_SERVER_URL}/client/articles?locale=${locale}&perPage=6&page=${page + 1}`
//             );
//             const json = await res.json();
//             setArticles((prev) => [...prev, ...json.data]);
//             setPage(json.meta.current_page);
//             setLastPage(json.meta.last_page);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     }, [page, lastPage, loading]);

//     useEffect(() => {
//         const handleScroll = () => {
//             if (
//                 window.innerHeight + window.scrollY >=
//                 document.body.offsetHeight - 200
//             ) {
//                 loadMore();
//             }
//         };
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, [loadMore]);

//     useEffect(() => {
//         const handleEscOrClick = (e: MouseEvent | KeyboardEvent) => {
//             if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
//             router.push('/esports/news', { scroll: false });
//         };
//         if (slug) {
//             window.addEventListener('keydown', handleEscOrClick);
//             window.addEventListener('click', handleEscOrClick);
//         }
//         return () => {
//             window.removeEventListener('keydown', handleEscOrClick);
//             window.removeEventListener('click', handleEscOrClick);
//         };
//     }, [slug, router]);

//     return (
//         <div className="max-w-screen-2xl mx-auto px-4 py-12 relative">
//             <Title title1="Espor" title2="Haberleri" />

//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
//                 {articles.map((news) => (
//                     <div
//                         key={news.slug}
//                         onClick={() => router.push(`?haber=${news.slug}`, { scroll: false })}
//                         className="cursor-pointer bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
//                     >
//                         <div className="relative w-full group">
//                             <img
//                                 src={`${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${news.image}`}
//                                 alt={news.title}
//                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                             />
//                         </div>
//                         <div className="p-4">
//                             <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{news.title}</h3>
//                             <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{news.excerpt}</p>
//                             <span className="text-xs text-gray-400 mt-2 block">
//                                 {new Date(news.created_at).toLocaleDateString('tr-TR')}
//                             </span>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {loading && (
//                 <div className="text-center mt-6 text-gray-500">Yükleniyor...</div>
//             )}

//             {selectedNews && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
//                     onClick={() => router.back()}
//                 >
//                     <div
//                         className="bg-white dark:bg-gray-900 max-w-5xl w-full max-h-[70vh] mx-4 rounded-lg overflow-hidden shadow-xl relative z-60 flex"
//                         onClick={(e) => e.stopPropagation()}
//                         style={{ minHeight: '468px' }}
//                     >
//                         <div className="relative w-full md:w-1/2 h-full flex flex-col">
//                             <img
//                                 src={`${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${selectedNews.image}`}
//                                 alt={selectedNews.title}
//                                 className="object-cover w-full flex-grow"
//                             />

                            
//                             <div className="md:hidden bg-black bg-opacity-60 text-white p-4 flex justify-between items-center">
//                                 <h3 className="text-lg font-semibold truncate max-w-[80%]">{selectedNews.title}</h3>
//                                 <button aria-label="Yorumlar" className="flex items-center">
//                                     <MessageSquare />
//                                 </button>
//                             </div>
//                         </div>


//                         <div className="hidden md:flex md:w-1/2 p-6 max-h-full flex-col justify-between">
//                             <div className="overflow-y-auto pr-1">
//                                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedNews.title}</h2>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
//                                     {new Date(selectedNews.created_at).toLocaleDateString('tr-TR')}
//                                 </p>

//                                 <ToggleableContent content={selectedNews.excerpt} />

//                                 <div className="mt-4 border-t pt-4 space-y-3">
//                                     {fakeComments.map((comment, index) => (
//                                         <div key={index} className="text-sm">
//                                             <p className="font-medium text-gray-800 dark:text-white">{comment.author}</p>
//                                             <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Yorum yazma alanı */}
//                             <div className="mt-4 pt-4 border-t flex items-center gap-2">
//                                 <input
//                                     type="text"
//                                     className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
//                                     placeholder="Yorumunuzu yazın..."
//                                 />
//                                 <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm">
//                                     Gönder
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ArticlesPage;
