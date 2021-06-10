require('dotenv').config();
const Alpaca = require('@alpacahq/alpaca-trade-api')

const alpacaInstance = new Alpaca({
  keyId: process.env.APIKEY,
  secretKey: process.env.SECRET,
  paper: true,
  usePolygon: false
})

const buyMarket = async ({symbol, amt}) => {
    try {
        return await alpacaInstance.createOrder({
            symbol: symbol,
            qty: amt,
            side: 'buy',
            type: 'market',
            time_in_force: 'day'
        })
    }
    catch(e) {
        console.log('error: ', e)
    }
};

const sellStop = async ({symbol, price, amt}) => {
    // hit api to set a stop sell order of symbol @ amt @ price
    await new Promise(res => {
        setTimeout(() => {
            res({price: 10.35});
        });
    });
};

const sellLimit = async ({symbol, price, amt}) => {
    // hit api to set a stop sell order of symbol @ amt @ price
    await new Promise(res => {
        setTimeout(() => {
            res({price: 10.35});
        });
    });
};

module.exports = {
    buyMarket, sellStop, sellLimit
};
