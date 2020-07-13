import { Table, Column, PrimaryKey, ForeignKey, Model, BelongsTo, DataType } from 'sequelize-typescript';
import { Player, Competition } from '.';

// Define other table options
const options = {
  modelName: 'participations',
  indexes: [
    {
      unique: true,
      fields: ['playerId', 'competitionId']
    }
  ]
};

@Table(options)
export default class Participation extends Model<Participation> {
  @PrimaryKey
  @ForeignKey(() => Player)
  @Column({ type: DataType.INTEGER, onDelete: 'CASCADE' })
  playerId: number;

  @PrimaryKey
  @ForeignKey(() => Competition)
  @Column({ type: DataType.INTEGER, onDelete: 'CASCADE' })
  competitionId: number;

  @BelongsTo(() => Player)
  player: Player;

  @BelongsTo(() => Competition)
  competition: Competition;
}