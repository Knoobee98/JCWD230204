require('dotenv').config();

const withSsl = (dbConfig) => {
  if (process.env.DB_SSL === 'true') {
    dbConfig.dialectOptions = { ssl: { rejectUnauthorized: false } };
  }
  return dbConfig;
};

module.exports = {
  development: withSsl({
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gamepediadb',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql'
  }),
  test: withSsl({
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'database_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql'
  }),
  production: withSsl({
    username: process.env.DB_USERNAME || 'jcwd230204',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'jcwd230204',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql'
  })
};
