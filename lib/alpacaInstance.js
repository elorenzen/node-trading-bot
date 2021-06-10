const Alpaca = require('@alpacahq/alpaca-trade-api')

const alpacaInstance = new Alpaca({
  keyId: process.env.APIKEY,
  secretKey: process.env.SECRET,
  paper: true,
  usePolygon: false
})

export { alpacaInstance }
