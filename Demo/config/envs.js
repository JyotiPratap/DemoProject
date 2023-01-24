/* eslint-disable max-len */
module.exports = {
  PORT: process.env.PORT || 8200,
  QUEUE_PORT: process.env.QUEUE_PORT || 8010,
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,

  QUEUE_CONCURRENCY: process.env.QUEUE_CONCURRENCY,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || 1800,

  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS, 10) || 10,

};
