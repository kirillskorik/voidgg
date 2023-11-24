export interface IMatch {
  info: {
    participants: Array<IMatchParticipant>;
    gameDuration: number;
    gameMode: string;
  }
}

export interface IMatchParticipant {
  kills: number;
  assists: number;
  deaths: number;
  puuid: string;
  summonerId: string;
  timePlayed: number;
  totalMinionsKilled: number;
  wardsPlaced: number;
  win: boolean;
  championName: string;
  role: string;
}

export type IPlayerMatchesData = Array<{
    csPerMinute: number;
    wards: number;
    kills: number;
    deaths: number;
    assists: number;
}>

export interface IMatchStatistics {
    kda: string;
    csPerMinute: number;
    isPlayerWon: boolean;
    gameMode: string;
    championUsed: string;
    role: string;
}