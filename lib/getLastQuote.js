require('dotenv').config();
const Alpaca = require('@alpacahq/alpaca-trade-api')

const alpacaInstance = new Alpaca({
  keyId: process.env.APIKEY,
  secretKey: process.env.SECRET,
  paper: true,
  usePolygon: false
})


const getLastQuote = async (ticker) => {
    try {
        return await alpacaInstance.lastQuote(ticker)
    }
    catch(e) {
        console.log('error: ', e)
    }
};

module.exports = getLastQuote;
