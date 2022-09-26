import { EnvStore } from './src/model/env-store';

const envStore = new EnvStore();

const connection = {
  host: envStore.dbHost,
  port: envStore.dbPort,
  database: envStore.dbName,
  user: envStore.dbUser,
  password: envStore.dbPassword,
};

export default {
  client: 'pg',
  connection,
  pool: { min: 5, max: 30 },
  migrations: {
    directory: './src/database/migrations',
  },
  seeds: {
    directory: './src/database/seeds',
  },
};
