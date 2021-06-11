const getDownTrendingStock = () => {
    const tickers = [
        'SDC', // Last = 9.94
        // 'CLM', // Last = 11.61
        'NAVI', // Last = 19.10
        'PTY', // Last = 20.44
        // 'SUMO', // Last = 20.82
        'SLQT', // Last = 21.33
        // 'GOF', // Last = 21.52
        // 'VALE', // Last = 22.15
        // 'QQQX', // Last = 29.17
        // 'HPQ', // Last = 30.05
        // 'NET' // Last = 90
    ]
    return tickers[Math.floor(Math.random() * tickers.length)];
};

const getStocks = () => {
    return [
        'AEVA', 'ASX', 'BFLY', 'BNGO', 'BSMX',
        'CLDR', 'FTI', 'GGB', 'HIMX', 'OUST',
        'PBR', 'QRTEA', 'SRNE', 'UBS', 'UMC'
    ]
};

module.exports ={
    getDownTrendingStock,
    getStocks
};
