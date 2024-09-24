module.exports = {
  development: {
    type: 'development',
    port: 3000,
    mongodb: process.env.mongostring,
    limiter: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100,
      standardHeaders: 'draft-7',
      legacyHeaders: false
    }
  },
  production: {
    type: 'production',
    port: 3000,
    mongodb: process.env.mongostring
  }
};