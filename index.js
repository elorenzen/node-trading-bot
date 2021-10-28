require('dotenv').config();
const getStocks = require('./lib/getDownTrendingStock');
const bullishEngulfing = require('./lib/strategies/bullishEngulfing');
const threeLineStrike = require('./lib/strategies/threeLineStrike');
const getPositions = require('./lib/getAllPositions');
const twentyForty = require('./lib/strategies/twentyForty');
const { ocoSell } = require('./lib/order')

const init = async () => {
    const tickers = await getStocks();

    const now = new Date();
    const hourNow = now.getHours()
    const dayOfWeek = now.getDay()

    // Market is open
    if (
        hourNow >= 7 &&
        hourNow < 13 &&
        (dayOfWeek >= 1 && dayOfWeek <= 5)
    ) {
        console.log('Market is open!')

        tickers.forEach(ticker => {
            threeLineStrike(ticker)
            setInterval(threeLineStrike, 60 * 1000, ticker);
        })
    
        tickers.forEach(ticker => {
            bullishEngulfing(ticker);
            setInterval(bullishEngulfing, 60 * 1000, ticker);
        })

        tickers.forEach(ticker => {
            twentyForty(ticker)
            setInterval(twentyForty, 60 * 1000, ticker);
        })
    }
    else console.log('Market is closed.')
}
init();
