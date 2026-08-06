require('dotenv').config();
const parsePgUrl = require('pg-connection-string').parse;

const withSsl = (dbConfig) => {
  if (process.env.DB_SSL === 'true' || dbConfig.ssl) {
    dbConfig.dialectOptions = { ssl: { rejectUnauthorized: false } };
  }
  delete dbConfig.ssl;
  return dbConfig;
};

const resolveDb = (env) => {
  if (process.env.DB_URL) {
    const parsed = parsePgUrl(process.env.DB_URL);
    return {
      username: parsed.user,
      password: parsed.password,
      database: parsed.database,
      host: parsed.host,
      port: parsed.port || process.env.DB_PORT,
      dialect: process.env.DB_DIALECT || 'postgres',
      ssl: parsed.ssl
    };
  }
  const defaults = {
    development: 'gamepediadb',
    test: 'database_test',
    production: 'jcwd230204'
  };
  return {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || defaults[env],
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql'
  };
};

module.exports = {
  development: withSsl(resolveDb('development')),
  test: withSsl(resolveDb('test')),
  production: withSsl(resolveDb('production'))
};
