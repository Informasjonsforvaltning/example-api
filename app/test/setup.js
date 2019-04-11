const waitPort = require('wait-port');
const io = require('socket.io-client');

before(async () => {
  const params = {
    host: 'localhost',
    port: 8080,
  }

  waitPort(params)
    .then((open) => {
      if (open) console.log('The port is now open!')
      else console.log('The port did not open before the timeout...')
    })
    .catch((err) => {
      console.err(`An unknown error occured while waiting for the port: ${err}`)
    })
})
