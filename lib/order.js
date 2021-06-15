require('dotenv').config();
const Alpaca = require('@alpacahq/alpaca-trade-api')

const alpacaInstance = new Alpaca({
  keyId: process.env.APIKEY,
  secretKey: process.env.SECRET,
  paper: true,
  usePolygon: false
})

const buyMarket = async (ticker, amt) => {
    try {
        return await alpacaInstance.createOrder({
            symbol: ticker,
            qty: amt,
            side: 'buy',
            type: 'market',
            time_in_force: 'day'
        }).then(order => {
            return alpacaInstance.getOrder(order.id)
        })
    }
    catch(e) {
        console.log('error: ', e)
    }
};

const sellStop = async ({ticker, price, amt}) => {
    try {
        return await alpacaInstance.createOrder({
            symbol: ticker,
            qty: amt,
            side: 'sell',
            type: 'stop',
            time_in_force: 'day',
            stop_price: price,
        })
    }
    catch(e) {
        console.log('error: ', e)
    }
};

const sellLimit = async ({ticker, price, amt}) => {
    console.log('ticker(in sellLimit()): ', ticker)
    console.log('price(in sellLimit()): ', price)
    console.log('amt(in sellLimit()): ', amt)
    try {
        return await alpacaInstance.createOrder({
            symbol: ticker,
            qty: amt,
            side: 'sell',
            type: 'limit',
            time_in_force: 'day',
            limit_price: price
        })
    }
    catch(e) {
        console.log('error: ', e)
    }
};

module.exports = {
    buyMarket, sellStop, sellLimit
};
