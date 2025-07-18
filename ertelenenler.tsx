
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