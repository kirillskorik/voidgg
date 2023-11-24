import type { DataSource, Repository } from 'typeorm'
import { Player } from './player.entity'

export const PlayerProviders = [
    {
        provide: 'PLAYER_REPOSITORY',
        useFactory: (dataSource: DataSource): Repository<Player> => {
            return dataSource.getRepository(Player)
        },
        inject: ['DATA_SOURCE'],
    },
]