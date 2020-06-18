import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
import { Sequelize } from 'sequelize-typescript';
import {
  Achievement,
  Competition,
  Group,
  InitialValues,
  Membership,
  Participation,
  Player,
  Record,
  Snapshot
} from './models';

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  storage: process.env.DB_STORAGE,
  dialect: 'postgres',
  logging: false,
  pool: { max: 40, min: 2, acquire: 20000, idle: 5000 },
  retry: { max: 10 }
});
sequelize.addModels([
  Achievement,
  Competition,
  Group,
  InitialValues,
  Membership,
  Participation,
  Player,
  Record,
  Snapshot
]);

// Import and define all models
// const models = {
//   Player: sequelize.import(`../api/modules/players/player.model`),
//   Snapshot: sequelize.import(`../api/modules/snapshots/snapshot.model`),
//   InitialValues: sequelize.import(`../api/modules/snapshots/initialValues.model`),
//   Record: sequelize.import(`../api/modules/records/record.model`),
//   Competition: sequelize.import(`../api/modules/competitions/competition.model`),
//   Participation: sequelize.import(`../api/modules/competitions/participation.model`),
//   Group: sequelize.import(`../api/modules/groups/group.model`),
//   Membership: sequelize.import(`../api/modules/groups/membership.model`),
//   Achievement: sequelize.import(`../api/modules/achievements/achievement.model`)
// };

// Setup all model associations
// Object.keys(models).forEach(modelName => {
//   if (models[modelName].associate) {
//     models[modelName].associate(models);
//   }
// });

// export default {
//   sequelize,
//   ...models
// }

export { sequelize };