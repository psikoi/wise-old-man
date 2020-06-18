import { SKILLS, BOSSES, ACTIVITIES, getRankKey, getValueKey } from '../../api/constants/metrics';
import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Model,
  ForeignKey,
  BelongsTo,
  AllowNull
} from 'sequelize-typescript';
import { Player } from '.';
import HiscoreValues from './hiscoreValues.model';

// Define other table options
const options = {
  modelName: 'initialValues',
  createdAt: false,
  indexes: [
    {
      unique: true,
      fields: ['id']
    },
    {
      fields: ['playerId']
    }
  ]
};

@Table(options)
export default class InitialValues extends HiscoreValues {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => Player)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, onDelete: 'CASCADE' })
  playerId: number;

  @BelongsTo(() => Player)
  player: Player;
}

function buildDynamicSchema(DataTypes) {
  const obj = {};

  SKILLS.forEach(s => {
    obj[getRankKey(s)] = {
      type: DataTypes.INTEGER,
      defaultValue: -1,
      allowNull: false
    };
    obj[getValueKey(s)] = {
      type: s === 'overall' ? DataTypes.BIGINT : DataTypes.INTEGER,
      defaultValue: -1,
      allowNull: false,
      get() {
        // As experience (overall) can exceed the integer maximum of 2.147b,
        // we have to store it into a BIGINT, however, sequelize returns bigints
        // as strings, to counter that, we convert every bigint to a JS number
        return parseInt(this.getDataValue(getValueKey(s)), 10);
      }
    };
  });

  ACTIVITIES.forEach(s => {
    obj[getRankKey(s)] = {
      type: DataTypes.INTEGER,
      defaultValue: -1,
      allowNull: false
    };
    obj[getValueKey(s)] = {
      type: DataTypes.INTEGER,
      defaultValue: -1,
      allowNull: false
    };
  });

  BOSSES.forEach(s => {
    obj[getRankKey(s)] = {
      type: DataTypes.INTEGER,
      defaultValue: -1,
      allowNull: false
    };
    obj[getValueKey(s)] = {
      type: DataTypes.INTEGER,
      defaultValue: -1,
      allowNull: false
    };
  });

  return obj;
}

// export default (sequelize, DataTypes) => {
//   const schema = {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     playerId: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     ...buildDynamicSchema(DataTypes)
//   };

//   // Define other table options
//   const options = {
//     createdAt: false,
//     indexes: [
//       {
//         unique: true,
//         fields: ['id']
//       },
//       {
//         fields: ['playerId']
//       }
//     ]
//   };

//   // Create the model
//   const InitialValues = sequelize.define('initialValues', schema, options);

//   // Define all model associations
//   InitialValues.associate = models => {
//     InitialValues.belongsTo(models.Player, {
//       foreignKey: 'playerId',
//       onDelete: 'CASCADE'
//     });
//   };

//   return InitialValues;
// };