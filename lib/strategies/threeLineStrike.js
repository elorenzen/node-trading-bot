const getBars = require('../getBars');
const { buyMarket, sellStop, sellLimit } = require('../order');
const getAccountValue = require('../getAccountValue');

const threeLineStrike = async (ticker) => {
    const accountInfo = await getAccountValue()
    const buyingPower = accountInfo.buying_power

    // look at last 2 interval candles before the current minute
    const oneMinuteMS = 60000;
    const now = new Date();
    const start = new Date(now - (4 * oneMinuteMS)).toISOString();
    const end = new Date(now - oneMinuteMS).toISOString();
    console.log(`Checking ${ticker} bars for 3-line strike: `, end, start);

    const bars = await getBars({ticker, start, end});
    const bar1 = bars[ticker][0];
    const bar2 = bars[ticker][1];
    const bar3 = bars[ticker][2];
    const bar4 = bars[ticker][3];

    // recognize three-line strike
    if (
        // Check if bars 1-4 exist
        (bar1 && bar2 && bar3 && bar4) &&
        // Is bar1 opening val greater than bar1 closing val?
        (bar1.o > bar1.c) &&
        // Is bar2 opening val greater than bar1 closing val?
        (bar2.o > bar1.c) &&
        // Is bar2 closing val less than bar2 opening val?
        (bar2.c < bar2.o) &&
        // Is bar3 opening val greater than bar2 closing val?
        (bar3.o > bar2.c) &&
        // Is bar3 closing val less than bar3 opening val?
        (bar3.c < bar3.o) &&
        // Is bar4 lowest val less than bar3 closing val?
        (bar4.l < bar3.c) &&
        // Is bar4 high greater than bar1 opening val?
        (bar4.h > bar1.o) &&
        // Is bar4 volume higher than bar3 value?
        (bar4.v > bar3.v)
    ) {
        // Get 10% of account buying power
        const willingToSpend = buyingPower * .1;

        // Find how many shares we can buy with 10% of account value
        const amt = Math.floor(willingToSpend / bar4.c);

        // Buy this stock
        const purchase = await buyMarket({ticker, amt});
        console.log('purchase: ', purchase)
        
        // set stop at bar1 low price
        sellStop({ticker, price: bar3.l, amt});

        // set 100% limit sell at 2:1 profit ratio, which comes out to ((purchase price - stop price) * 2) + purchase price
        const profitTarget = ((purchase.filled_average_price - bar3.l) * 2) + purchase.filled_average_price;
        sellLimit({ticker, price: profitTarget, amt});
    }
}

module.exports = threeLineStrike