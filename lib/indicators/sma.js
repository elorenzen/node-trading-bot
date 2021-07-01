const getBars = require('../getTenDayBars')

// 10-SMA = (Sum(Price, n))/n, where n = time period(10 days)

const sma = async (ticker) => {
    const oneMinuteMS = 60000;
    const oneDayMS = oneMinuteMS * 1440
    const now = new Date();

    const start = new Date(now - (10 * oneDayMS)).toISOString();
    const end = new Date(now).toISOString();
    console.log(`Checking ${ticker} bars for 10 days: `, end, start);
    const bars = await getBars({ticker, start, end})
    
    const closeArr = bars[ticker].map(bar => bar.c)
    const closePriceSum = closeArr.reduce((a, b) => a + b, 0)
    const sma = closePriceSum / closeArr.length
    console.log('Close price array: ', closeArr)
    console.log('Close price sum: ', closePriceSum)
    console.log('Small Moving Average: ', sma)
    
    return sma
};

module.exports = sma
