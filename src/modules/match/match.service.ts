import { HttpException, Injectable } from '@nestjs/common'
import axios from 'axios'

import { DEFAULT_URL } from '../../consts'
import { transformRegion } from './utils'
import type { IMatch, IMatchStatistics, IPlayerMatchesData } from './match.types'

@Injectable()
export class MatchService {
    private readonly headers = {
        'Content-Type': 'application/json',
        'X-Riot-Token': process.env['RIOT_API_KEY'],
    }

    public async getMatchesIdsByPuuid(puuid: string, region: string, limit: number = 10, offset: number = 0): Promise<Array<string>> {
        try {
            const response = await axios.get<Array<string>>(
                `https://${region}.${DEFAULT_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${offset}&count=${limit}`,
                {
                    headers: this.headers,
                },
            )

            return response.data
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    public async getMatchById(matchId: string, region: string): Promise<IMatch> {
        try {
            const response = await axios.get(
                `https://${region}.${DEFAULT_URL}/lol/match/v5/matches/${matchId}`,
                {
                    headers: this.headers,
                },
            )
            return response.data
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    public async getGamesStatistics(puuid: string, region: string,  limit: number, offset: number): Promise<Array<IMatchStatistics>> {
        const regionShard = transformRegion(region)

        const matchesIds = await this.getMatchesIdsByPuuid(puuid, regionShard, limit, offset)

        const matches = await Promise.all(
            matchesIds.slice().map(async(matchId) => {
                const match = await this.getMatchById(matchId, regionShard)
                return match
            }),
        )
        return matches.map((match) => {
            const participant = match.info.participants.find((participant) => {
                return participant.puuid === puuid
            })!

            const timeInMinutes = match.info.gameDuration / 60

            return {
                kda: `${participant.kills}/${participant.deaths}/${participant.assists}`,
                csPerMinute: participant.totalMinionsKilled / timeInMinutes,
                isPlayerWon: participant.win,
                gameMode: match.info.gameMode,
                championUsed: participant.championName,
                role: participant.role,
            }
        })
    }

    public async getPlayerMatchesData(puuid: string, region: string, limit: number): Promise<IPlayerMatchesData> {
        const regionShard = transformRegion(region)

        const matchesIds = await this.getMatchesIdsByPuuid(puuid, regionShard, limit)

        const matches = await Promise.all(
            matchesIds.slice().map(async(matchId) => {
                const match = await this.getMatchById(matchId, regionShard)
                return match
            }),
        )

        return matches.map((match) => {
            const participant = match.info.participants.find((participant) => {
                return participant.puuid === puuid
            })!

            const timeInMinutes = match.info.gameDuration / 60

            return {
                csPerMinute: participant.totalMinionsKilled / timeInMinutes,
                wards: participant.wardsPlaced,
                kills: participant.kills,
                deaths: participant.deaths,
                assists: participant.assists,
            }
        })
    }
}
