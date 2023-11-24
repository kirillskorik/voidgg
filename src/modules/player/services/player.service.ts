import { HttpException, Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

import type { Player } from '../player.entity'
import type { IGetLeaderBoardPlaceRes } from '../player.types'

@Injectable()
export class PlayerService {
    constructor(
      @Inject('PLAYER_REPOSITORY')
      private readonly playerRepository: Repository<Player>,
    ) {}

    public async getAll(): Promise<Array<Player>> {
        return this.playerRepository.find()
    }

    public async findOne(summonerName: string): Promise<Player | null> {
        return this.playerRepository.findOne({
            where: {
                summonerName,
            },
        })
    }

    public async create(player: Partial<Player>): Promise<Player> {
        return this.playerRepository.save(player)
    }

    public async update(player: Partial<Player>): Promise<Player> {
        return this.playerRepository.save(player)
    }

    public async getLeaderBoardPlace(name: string, region: string): Promise<IGetLeaderBoardPlaceRes> {
        const player = await this.playerRepository.findOne({
            where: {
                summonerName: name,
                region,
            },
        })

        if (!player) {
            throw new HttpException('Player not found', 404)
        }

        const leaguePoints = await this.playerRepository
            .createQueryBuilder('player')
            .select('player.leaguePoints')
            .orderBy('player.leaguePoints', 'DESC')
            .getMany()

        const winrate = await this.playerRepository
            .createQueryBuilder('player')
            .select('player.winrate')
            .orderBy('player.winrate', 'DESC')
            .getMany()

        const leaguePointsPlace = leaguePoints.findIndex((item) => {
            return item.leaguePoints === player.leaguePoints
        }) + 1
        const winratePlace = winrate.findIndex((item) => {
            return item.winrate === player.winrate
        }) + 1

        return {
            leaguePoints: {
                top: leaguePointsPlace,
            },
            winrate: {
                top: winratePlace,
            },
        }
    }

    // public async getPlayerLeaderBoardPlace(summonerName: string): Promise<number> {}
}
