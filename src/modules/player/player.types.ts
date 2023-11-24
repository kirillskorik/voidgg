import type { IMatchStatistics } from '../match/match.types'
export interface IGetPlayerByNameRes {
	id: string,
	accountId: string,
	puuid: string,
	name: string,
	profileIconId: number,
	revisionDate: number,
	summonerLevel: number
}

export interface IGetSummonerRes {
    leagueId: string,
    queueType: string,
    tier: string,
    rank: string,
    summonerId: string,
    summonerName: string,
    leaguePoints: number,
    wins: number,
    losses: number,
    veteran: boolean,
    inactive: boolean,
    freshBlood: boolean,
    hotStreak: boolean
}

export interface IGetPlayerInfoRes {
    rank: string;
    name: string;
    region: string;
    profileIconId: number;
    leaguePoints: number;
    wins: number;
    losses: number;
    kda: string;
    averageVisionScore: number;
    csPerMinute: number;
}

export interface IAverageData {
    csPerMinute: number;
    wards: number;
    deaths: number;
    kills: number;
    assists: number;
}

export interface IGetLeaderBoardPlaceRes {
    leaguePoints: {
        top: number;
    };
    winrate: {
        top: number;
    };
}

export interface IGetPlayerMatchesStatistic {
    name: string;
    region: string;
    matches: Array<IMatchStatistics>;
}