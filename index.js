require('dotenv').config();
const getStocks = require('./lib/getDownTrendingStock');
const bullishEngulfing = require('./lib/strategies/bullishEngulfing');
const threeLineStrike = require('./lib/strategies/threeLineStrike');

const init = async () => {
    const tickers = await getStocks();
    console.log('tickers: ', tickers)

    tickers.forEach(ticker => {
        threeLineStrike(ticker)
        setInterval(threeLineStrike, 60 * 1000, ticker);
    })

    tickers.forEach(ticker => {
        bullishEngulfing(ticker);
        setInterval(bullishEngulfing, 60 * 1000, ticker);
    })
}
init();
