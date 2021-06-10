const { alpacaInstance } = require('./alpacaInstance');

const buyMarket = async ({symbol, amt}) => {
    // hit api to buy a market order of symbol @ amt
    await alpacaInstance.createOrder({
        symbol: symbol, // any valid ticker symbol
        qty: amt,
        side: 'buy',
        type: 'market',
        time_in_force: 'day'
    })
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
