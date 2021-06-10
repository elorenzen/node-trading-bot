require('dotenv').config();
const getDownTrendingStock = require('./lib/getDownTrendingStock');
const getBars = require('./lib/getBars');
const getAccountValue = require('./lib/getAccountValue');
const { buyMarket, sellStop, sellLimit } = require('./lib/order');

const init = async () => {
    // find downtrending stock
    const symbol = await getDownTrendingStock();
    console.log('symbol: ', symbol)
    const accountInfo = await getAccountValue()
    const buyingPower = accountInfo.buying_power
    console.log('getAccountValue: ', buyingPower)

    // Check every minute
    const checkAndOrder = async () => {
        // look at last 2 interval candles before the current minute
        const oneMinuteMS = 60000;
        const now = new Date();
        const start = new Date(now - (2 * oneMinuteMS)).toISOString();
        const end = new Date(now - oneMinuteMS).toISOString();
        console.log('Checking bars', end, start);

        const bars = await getBars({symbol, start, end});
        const bar1 = bars[symbol][0];
        const bar2 = bars[symbol][1];

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
            const purchase = await buyMarket({symbol, amt});
            console.log('purchase: ', purchase)
            
            // set stop at bar1 low price
            sellStop({symbol, price: bar1.l, amt});

            // set 100% limit sell at 2:1 profit ratio, which comes out to ((purchase price - stop price) * 2) + purchase price
            const profitTarget = ((purchase.price - bar1.l) * 2) + purchase.price;
            sellLimit({symbol, price: profitTarget, amt});
        }
    }
    checkAndOrder();
    setInterval(checkAndOrder, 60 * 1000);
}
init();
