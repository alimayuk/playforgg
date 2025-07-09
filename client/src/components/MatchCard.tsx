import React from 'react';

interface Team {
    name: string;
    logo: string;
}

interface Streams {
    twitch?: string;
    youtube?: string;
    kick?: string;
}

export interface Match {
    id: number;
    teamA: Team;
    teamB: Team;
    time: string;
    date: string;
    tournament: string;
    streams?: Streams;
}

interface MatchCardProps {
    match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    return (
        <div
            key={match.id}
            className="bg-[#0f172a] shadow-lg rounded-2xl p-6 flex flex-col gap-4 border hover:shadow-xl transition duration-300 border-l-4 border-orange-600"
        >
            {/* Takımlar */}
            <div className="flex items-center justify-between gap-4">
                {/* Team A */}
                <div className="flex items-center gap-3 w-full">
                    <img
                        src={match.teamA.logo}
                        alt={match.teamA.name}
                        className="w-10 h-10 object-contain"
                    />
                    <span className="font-semibold text-gray-100">{match.teamA.name}</span>
                </div>

                {/* Maç Saati */}
                <div className="flex flex-col items-center justify-center w-full">
                    <span className="text-lg font-bold text-orange-500 leading-tight">
                        {match.time}
                    </span>
                    <span className="text-xs text-gray-400">{match.date}</span>
                </div>

                {/* Team B */}
                <div className="flex items-center gap-3 w-full justify-end">
                    <span className="font-semibold text-gray-100">{match.teamB.name}</span>
                    <img
                        src={match.teamB.logo}
                        alt={match.teamB.name}
                        className="w-10 h-10 object-contain"
                    />
                </div>
            </div>

            {/* Turnuva Bilgisi */}
            <div className="text-sm text-center italic text-gray-400">
                {match.tournament}
            </div>

            {/* Yayın Linkleri */}
            <div className="gap-3 pt-4 flex">
                <span className="text-xs text-gray-500">İzle:</span>
                {match.streams?.twitch && (
                    <a
                        href={match.streams.twitch}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Twitch"
                        className="hover:scale-110 transition-transform"
                    >
                        <img
                            src="https://simpleicons.org/icons/twitch.svg"
                            className="w-5 h-5 invert"
                            alt="Twitch"
                        />
                    </a>
                )}
                {match.streams?.youtube && (
                    <a
                        href={match.streams.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="YouTube"
                        className="hover:scale-110 transition-transform"
                    >
                        <img
                            src="https://simpleicons.org/icons/youtube.svg"
                            className="w-5 h-5 invert"
                            alt="YouTube"
                        />
                    </a>
                )}
                {match.streams?.kick && (
                    <a
                        href={match.streams.kick}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Kick"
                        className="hover:scale-110 transition-transform"
                    >
                        <img
                            src="https://simpleicons.org/icons/kick.svg"
                            className="w-5 h-5 invert"
                            alt="Kick"
                        />
                    </a>
                )}
            </div>
        </div>
    );
};

export default MatchCard;
