import { HttpException, Injectable } from '@nestjs/common'
import axios from 'axios'

import type { IAverageData, IGetPlayerByNameRes, IGetPlayerInfoRes, IGetPlayerMatchesStatistic, IGetSummonerRes } from '../player.types'
import { MatchService } from '../../../modules/match/match.service'
import type { IPlayerMatchesData } from '../../../modules/match/match.types'

import { DEFAULT_URL } from '../../../consts'
import { PlayerService } from './player.service'

@Injectable()
export class PlayerApiService {
    private readonly headers = {
        'Content-Type': 'application/json',
        'X-Riot-Token': process.env['RIOT_API_KEY'],
    }

    constructor(private readonly matchService: MatchService,
            private readonly playerService: PlayerService) {}

    public async getPlayerByName(name: string, region: string): Promise<IGetPlayerByNameRes> {
        try {
            const response = await axios.get<IGetPlayerByNameRes>(
                `https://${region}.${DEFAULT_URL}/lol/summoner/v4/summoners/by-name/${name}`,
                {
                    headers: this.headers,
                })
            return response.data
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    public async getSummonerByEncryptedAccountId(encryptedAccountId: string, region: string): Promise<IGetSummonerRes> {
        try {
            const response = await axios.get<IGetSummonerRes>(
                `https://${region}.${DEFAULT_URL}/lol/league/v4/entries/by-summoner/${encryptedAccountId}`,
                {
                    headers: this.headers,
                },
            )

            return response.data[0]
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    public async getPlayerInfo(name: string, region: string): Promise<IGetPlayerInfoRes> {
        try {
            const player = await this.getPlayerByName(name, region)
            const summoner = await this.getSummonerByEncryptedAccountId(player.id, region)
            const matches = await this.matchService.getPlayerMatchesData(player.puuid, region, 10)

            const averageData = this.calculateAverageData(matches)

            await this.saveToDb(summoner, region)

            return {
                rank: summoner.rank,
                name: player.name,
                region: region.toUpperCase(),
                profileIconId: player.profileIconId,
                leaguePoints: summoner.leaguePoints,
                wins: summoner.wins,
                losses: summoner.losses,
                kda: `${averageData.kills}/${averageData.deaths}/${averageData.assists}`,
                averageVisionScore: averageData.wards,
                csPerMinute: averageData.csPerMinute,
            }
        } catch (error) {
            return error
        }
    }

    public async getPlayerMatchesStatistic(name: string, region: string, limit: number, offset)
    : Promise<IGetPlayerMatchesStatistic> {
        try {
            const player = await this.getPlayerByName(name, region)
            const matches = await this.matchService.getGamesStatistics(player.puuid, region, limit, offset)
            const summoner = await this.getSummonerByEncryptedAccountId(player.id, region)

            await this.saveToDb(summoner, region)

            return {
                name: player.name,
                region: region.toUpperCase(),
                matches,
            }
        } catch (error) {
            return error
        }
    }

    private calculateAverageData(matches: IPlayerMatchesData): IAverageData {
        const totalData: IAverageData = {
            csPerMinute: 0,
            wards: 0,
            deaths: 0,
            kills: 0,
            assists: 0,
        }

        for (const match of matches) {
            totalData.csPerMinute = totalData.csPerMinute + match.csPerMinute
            totalData.wards = totalData.wards + match.wards
            totalData.deaths = totalData.deaths + match.deaths
            totalData.kills = totalData.kills + match.kills
            totalData.assists = totalData.assists + match.assists
        }

        const totalMatches = matches.length || 1

        return {
            csPerMinute: Math.round(totalData.csPerMinute / totalMatches),
            wards: Math.round(totalData.wards / totalMatches),
            deaths: Math.round(totalData.deaths / totalMatches),
            kills: Math.round(totalData.kills / totalMatches),
            assists: Math.round(totalData.assists / totalMatches),
        }
    }

    private async saveToDb(summoner: IGetSummonerRes, region: string): Promise<void> {
        const summonerEntity = await this.playerService.findOne(summoner.summonerName)

        if (!summonerEntity) {
            await this.playerService.create({
                summonerName: summoner.summonerName,
                region,
                winrate: Math.round(summoner.wins / (summoner.wins + summoner.losses) * 100),
                leaguePoints: summoner.leaguePoints,
            })
        } else {
            await this.playerService.update({
                ...summonerEntity,
                winrate: Math.round(summoner.wins / (summoner.wins + summoner.losses) * 100),
                leaguePoints: summoner.leaguePoints,
            })
        }

        await this.playerService.create({
            summonerName: 'test',
            region: 'test',
            winrate: 0,
            leaguePoints: 0,
        })
    }
}
