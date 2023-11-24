import { Module } from '@nestjs/common'

import { PlayerApiService } from './services/player-api.service'
import { PlayerService } from './services/player.service'
import { PlayerController } from './player.controller'
import { DatabaseModule } from '../database/database.module'
import { PlayerProviders } from './player.providers'
import { MatchModule } from '../match/match.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { CacheInterceptor } from '@nestjs/cache-manager'

@Module({
    imports: [DatabaseModule, MatchModule],
    providers: [PlayerApiService, PlayerService, ...PlayerProviders, {
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor,
    },],
    controllers: [PlayerController],
    exports: [PlayerApiService],
})
export class PlayerModule {}
