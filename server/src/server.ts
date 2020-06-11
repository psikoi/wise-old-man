require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

import { app } from './api';
import { sequelize } from './database';


(async () => {
  await sequelize.sync();

  console.log(process.env.PORT);

  console.log(app);

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
})
