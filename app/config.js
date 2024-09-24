module.exports = {
  development: {
    type: 'development',
    port: 3000,
    mongodb: 'mongodb+srv://anthony:12345@cluster0.iceu3.mongodb.net/efrei',
    limiter : {
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
      standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
      legacyHeaders: false}
  },
  production: {
    type: 'production',
    port: 3000,
    mongodb: 'mongodb+srv://anthony:12345@cluster0.iceu3.mongodb.net/efrei'
  }
}