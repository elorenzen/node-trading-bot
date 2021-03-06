const getBars = require('../getBars');
const { buyMarket, ocoSell } = require('../order');
const getAccountValue = require('../getAccountValue');
const sma = require('../indicators/sma')

const threeLineStrike = async (ticker) => {
    const accountInfo = await getAccountValue()
    const buyingPower = accountInfo.buying_power

    // look at last 2 interval candles before the current minute
    const oneMinuteMS = 60000;
    const now = new Date();
    const start = new Date(now - (5 * oneMinuteMS)).toISOString();
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
        (bar4.v > bar3.v) &&
        // Is last closing price greater than 10-SMA?
        (bar4.c >= sma(ticker))
    ) {
        // Get 10% of account buying power
        const willingToSpend = buyingPower * .1;

        // Find how many shares we can buy with 10% of account value
        const amt = Math.floor(willingToSpend / bar4.c);

        // Buy this stock
        const purchase = await buyMarket(ticker, amt);
        console.log('3-Line Strike purchase: ', purchase)
        
        if (purchase.filled_avg_price !== null) {
            // set stop at bar1 low price
            const stopPrice = Number(purchase.filled_avg_price) - (Number(purchase.filled_avg_price) * .02)
            const profitTarget = (Number(purchase.filled_avg_price) * 1.05);
        
            ocoSell({ticker, stopPrice, profitTarget, amt})
        }
    }
}

module.exports = threeLineStrike