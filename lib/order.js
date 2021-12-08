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
        console.log('buy market order error: ', e.error)
    }
};

const ocoSell = async ({ticker, stopPrice, profitTarget, amt}) => {
    try {
        const stopLossLimit = (stopPrice - (stopPrice * .05)) 
        return await alpacaInstance.createOrder({
            symbol: ticker,
            qty: amt,
            side: 'sell',
            type: 'limit',
            time_in_force: 'gtc',
            order_class: 'oco',
            
            take_profit: {
                limit_price: profitTarget,
            },
            stop_loss: {
                stop_price: stopPrice,
                limit_price: stopLossLimit
            }
        })
    }
    catch(e) {
        console.log(e.error)
    }
}

const sellLimit = async ({ticker, price, amt}) => {
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
        console.log('sell limit order error: ', e.error)
    }
};

module.exports = {
    buyMarket, sellLimit, ocoSell
};
