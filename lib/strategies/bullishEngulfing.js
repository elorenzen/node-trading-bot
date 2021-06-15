const getBars = require('../getBars');
const { buyMarket, sellStop, sellLimit } = require('../order');
const getAccountValue = require('../getAccountValue');

const bullishEngulfing = async (ticker) => {
    const accountInfo = await getAccountValue()
    const buyingPower = accountInfo.buying_power

    // look at last 2 interval candles before the current minute
    const oneMinuteMS = 60000;
    const now = new Date();
    const start = new Date(now - (4 * oneMinuteMS)).toISOString();
    const end = new Date(now - oneMinuteMS).toISOString();
    console.log(`Checking ${ticker} bars for bullish engulfing: `, end, start);

    const bars = await getBars({ticker, start, end});
    const bar1 = bars[ticker][0];
    const bar2 = bars[ticker][1];

    // recognize bullish engulfing pattern
    if (
        // Check if bar1 and bar2 exist
        (bar1 && bar2) &&
        // Is bar1 closing val less than bar1 opening val?(red)
        (bar1.c < bar1.o) &&
        // Is bar2 closing val greater than bar2 opening val?(green)
        (bar2.c > bar2.o) &&
        // Is bar2 closing val greater than bar1 opening val?
        (bar2.c > bar1.o) &&
        // Is bar2 opening val less than bar1 closing val?
        (bar2.o < bar1.c) &&
        // Is bar2 volume greater than bar1 volume?
        (bar2.v > bar1.v)
    ) {
        // Get 10% of account buying power
        const willingToSpend = buyingPower * .1;

        // Find how many shares we can buy with 10% of account value
        const amt = Math.floor(willingToSpend / bar2.c);
        
        // Buy this stock
        const purchase = await buyMarket(ticker, amt);
        
        // set stop at bar1 low price
        sellStop({ticker, price: bar1.l, amt});
        
        // set 100% limit sell at 2:1 profit ratio, which comes out to ((purchase price - stop price) * 2) + purchase price
        const profitTarget = ((Number(purchase.filled_avg_price) - bar1.l) * 2) + Number(purchase.filled_avg_price);
        sellLimit({ticker, price: profitTarget, amt});
    }
}

module.exports = bullishEngulfing