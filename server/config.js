const joi = require('@hapi/joi')

// Define config schema
const schema = {
  port: joi.number().default(3000),
  env: joi.string().valid('development', 'test', 'production').default('development')
}

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV
}

// Validate config
const result = joi.validate(config, schema, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value

// Add some helper props
value.isDev = value.env === 'development'
value.isProd = value.env === 'production'
value.apiToken = 'sTb3nYv0WstprfpWP5StiLJnRgJ8zHUdNTTL2DqT64nqVUPBGFfqTWq32Exi'
value.dbUrl = 'mongodb://localhost:27017/sms_soccer_db'
value.secret = 'sTb3nYv0WstprfpWP5StiLJnRgJ8zHUdNTTL2DqT64nqVUPBGFfqTWq32Exi'
module.exports = value
