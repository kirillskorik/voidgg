import { DataSource } from 'typeorm'

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async(): Promise<DataSource> => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: process.env.POSTGRESQL_HOST,
                port: parseInt(process.env.POSTGRESQL_PORT ?? '5432'),
                username: process.env.POSTGRESQL_USERNAME,
                password: process.env.POSTGRESQL_PASSWORD,
                database: process.env.POSTGRESQL_DATABASE,
                synchronize: true,
                logging: true,
                entities: [
                    `${__dirname}/../**/*.entity{.ts,.js}`,
                ],
                migrations: [],
            })

            return dataSource.initialize()
        }
    }
]