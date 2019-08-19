const hapi = require('@hapi/hapi')
const config = require('./config')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  //await server.register(require('./plugins/router'))
  await server.register(require('./plugins/log-errors'))

  server.register(require('hapi-auth-jwt'), err => {
    // We are giving the strategy a name of 'jwt'
    server.auth.strategy('jwt', 'jwt', 'required', {
      key: config.secret,
      verifyOptions: { algorithms: ['HS256'] }
    });
  
    // Look through the routes in
    // all the subdirectories of API
    // and create a new route for each
    glob
      .sync('routes/**/*.js', {
        root: __dirname
      })
      .forEach(file => {
        const route = require(path.join(__dirname, file));
        server.route(route);
      });
  });

  if (config.isDev) {
    //await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  return server
}

module.exports = createServer
