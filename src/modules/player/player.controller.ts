import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { PlayerApiService } from './services/player-api.service'
import { PlayerService } from './services'
import { PlayerParamsValidation } from './validation/player-params.validation'
import type { IGetLeaderBoardPlaceRes, IGetPlayerInfoRes, IGetPlayerMatchesStatistic } from './player.types'
import { CacheTTL } from '@nestjs/cache-manager'

@ApiTags('players')
@Controller('players')
@CacheTTL(60 * 60 * 24)
export class PlayerController {
    constructor(private readonly playerApiService: PlayerApiService,
                private readonly playerService: PlayerService) {}

  @Get('matches/:name/:region')
  @UsePipes(new ValidationPipe({
      transform: true, transformOptions: {
          enableImplicitConversion: true
      }
  }))
    public async getPlayersMatches(@Param() {name, region}: PlayerParamsValidation,
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0
    ): Promise<IGetPlayerMatchesStatistic> {
        const statistic = await this.playerApiService.getPlayerMatchesStatistic(name, region, limit, offset)

        return statistic
    }

  @Get('info/:name/:region')
  @UsePipes(new ValidationPipe({
      transform: true, transformOptions: {
          enableImplicitConversion: true
      }
  }))
  public async getPlayerInfo(@Param() {name, region}: PlayerParamsValidation): Promise<IGetPlayerInfoRes> {
      const regionLower = region.toLowerCase()

      const playerInfo = await this.playerApiService.getPlayerInfo(name, regionLower)

      return playerInfo
  }

    @Get('leaderboard/:name/:region')
    @UsePipes(new ValidationPipe({
        transform: true, transformOptions: {
            enableImplicitConversion: true
        }
    }))
  public async getPlayerLeaderBoardPlace(@Param() {name, region}: PlayerParamsValidation): Promise<IGetLeaderBoardPlaceRes> {
      const leaderBoard = await this.playerService.getLeaderBoardPlace(name, region)

      return leaderBoard
  }
}
