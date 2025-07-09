import MatchCard from '@/components/MatchCard';
import Title from '@/components/Title'
import React from 'react'

// Oyunlara göre kategori oluşturmak için ek alan
const groupedMatches = [
  {
    id: 1,
    game: "Counter-Strike 2",
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
    game: "Valorant",
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
    game: "League of Legends",
    teamA: { name: "LoL Titans", logo: "https://am-a.akamaihd.net/image?resize=48:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png" },
    teamB: { name: "Blue Nexus", logo: "https://am-a.akamaihd.net/image?resize=48:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1726801573959_539px-T1_2019_full_allmode.png" },
    date: "09.07.2025",
    time: "21:45",
    tournament: "LoL Worlds Qualifier",
    streams: {
      youtube: "https://youtube.com/@lolworlds",
    },
  },
  {
    id: 4,
    game: "Valorant",
    teamA: { name: "Eagle Strike", logo: "https://owcdn.net/img/628ccb7095263.png" },
    teamB: { name: "Firestorm", logo: "https://www.vlr.gg/img/vlr/tmp/vlr.png" },
    date: "10.07.2025",
    time: "18:30",
    tournament: "Valorant Masters",
    streams: {
      twitch: "https://twitch.tv/eaglestrike",
    },
  },
  {
    id: 5,
    game: "Counter-Strike 2",
    teamA: { name: "IronFist", logo: "https://img-cdn.hltv.org/teamlogo/IejtXpquZnE8KqYPB1LNKw.svg?ixlib=java-2.1.0&s=7fd33b8def053fbfd8fdbb58e3bdcd3c" },
    teamB: { name: "Digital Thunder", logo: "https://img-cdn.hltv.org/teamlogo/yeXBldn9w8LZCgdElAenPs.png?ixlib=java-2.1.0&w=50&s=15eaba0b75250065d20162d2cb05e3e6" },
    date: "11.07.2025",
    time: "17:00",
    tournament: "Counter-Strike 2 Summer Cup",
    streams: {
      kick: "https://kick.com/ironfistlive",
    },
  },
  {
    id: 6,
    game: "League of Legends",
    teamA: { name: "Legion X", logo: "https://am-a.akamaihd.net/image?resize=48:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1726801573959_539px-T1_2019_full_allmode.png" },
    teamB: { name: "Frozen Wolves", logo: "https://am-a.akamaihd.net/image?resize=48:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png" },
    date: "12.07.2025",
    time: "20:00",
    tournament: "League of Legends Champions Arena",
    streams: {
      youtube: "https://youtube.com/@lolarena",
    },
  },
  {
    id: 7,
    game: "Valorant",
    teamA: { name: "StrikeZone", logo: "https://owcdn.net/img/628ccb7095263.png" },
    teamB: { name: "Rogue Elites", logo: "https://www.vlr.gg/img/vlr/tmp/vlr.png" },
    date: "13.07.2025",
    time: "22:00",
    tournament: "Valorant Night Fight",
    streams: {
      twitch: "https://twitch.tv/strikezone",
    },
  },
  {
    id: 8,
    game: "Counter-Strike 2",
    teamA: { name: "Team Omega", logo: "https://img-cdn.hltv.org/teamlogo/yeXBldn9w8LZCgdElAenPs.png?ixlib=java-2.1.0&w=50&s=15eaba0b75250065d20162d2cb05e3e6" },
    teamB: { name: "Alpha Project", logo: "https://img-cdn.hltv.org/teamlogo/IejtXpquZnE8KqYPB1LNKw.svg?ixlib=java-2.1.0&s=7fd33b8def053fbfd8fdbb58e3bdcd3c" },
    date: "14.07.2025",
    time: "21:15",
    tournament: "Counter-Strike 2 World Tour",
    streams: {
      youtube: "https://youtube.com/@cs2worldtour",
      kick: "https://kick.com/alphalive",
    },
  },
];

const groupedByGame = groupedMatches.reduce((acc, match) => {
  if (!acc[match.game]) {
    acc[match.game] = [];
  }
  acc[match.game].push(match);
  return acc;
}, {} as Record<string, typeof groupedMatches>);

const page = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12">
      <Title title1="Tüm" title2="Maçlar" />

      {Object.entries(groupedByGame).map(([game, matches]) => (
        <div key={game} className="space-y-12 mt-16">
          <h2 className="text-3xl font-bold text-orange-500">{game} Maçları</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
