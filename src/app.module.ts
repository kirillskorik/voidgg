import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'

import { PlayerModule } from './modules/player/player.module'
import { MatchModule } from './modules/match/match.module'
import { DatabaseModule } from './modules/database/database.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        },),
        CacheModule.register({
            isGlobal: true,
        }),
        DatabaseModule,
        PlayerModule,
        MatchModule,

    ],
})
export class AppModule {}
