import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
    public id: number

  @Column('text')
  public summonerName: string

  @Column('text')
  public region: string

  @Column('float')
  public winrate: number

  @Column('int')
  public leaguePoints: number
}