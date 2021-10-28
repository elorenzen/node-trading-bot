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
    console.log(ticker, ' sell data')
    console.log('Stop loss price ($): ', stopPrice)
    console.log('Profit target: ', profitTarget)
    console.log('Shares: ', amt)
    try {
        return await alpacaInstance.createOrder({
            symbol: ticker,
            qty: amt,
            side: 'sell',
            type: 'limit',
            time_in_force: 'gtc',
            take_profit: {
                limit_price: profitTarget,
            },
            stop_loss: {
                stop_price: stopPrice
            }
        })
    }
    catch(e) {
        console.log(e.error)
    }
}

module.exports = { buyMarket, ocoSell };
