require('dotenv').config();
const getStocks = require('./lib/getDownTrendingStock');
const bullishEngulfing = require('./lib/strategies/bullishEngulfing');
const threeLineStrike = require('./lib/strategies/threeLineStrike');
const getPositions = require('./lib/getAllPositions');
const twentyForty = require('./lib/strategies/twentyForty');
const { ocoSell } = require('./lib/order')

const init = async () => {
    const tickers = await getStocks();
    const positions = await getPositions()

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
        positions.forEach(position => {
            // Create sell limit, sell stop order for given symbol
            const ticker = position.symbol
            const amt = position.qty

            const stopPrice = Number(position.avg_entry_price) - (Number(position.avg_entry_price) * .02)
            const profitTarget = (Number(position.avg_entry_price) * 1.05);

            ocoSell({ticker, stopPrice, profitTarget, amt})
        })

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
