const getDownTrendingStock = () => {
    const tickers = [
        //'CLM', 
        'GOF', 'HPQ', 'NAVI', 'NET', 'PTY', 'QQQX', 'SDC', 'SLQT', 'SUMO', 'VALE']
    return tickers[Math.floor(Math.random() * tickers.length)];
};

module.exports = getDownTrendingStock;
