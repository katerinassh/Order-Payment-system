require('dotenv').config();

const { DATABASE_CLIENT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT } = process.env;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: DATABASE_NAME,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      host: DATABASE_HOST,
      port: DATABASE_PORT,
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
  },

  staging: {
    client: DATABASE_CLIENT,
    connection: {
      database: DATABASE_NAME,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      host: DATABASE_HOST,
      port: DATABASE_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: DATABASE_NAME,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      host: DATABASE_HOST,
      port: DATABASE_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
