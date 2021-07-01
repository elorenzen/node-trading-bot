const { sellStop, sellLimit } = require('../order');
const getPosition = require('../getPosition')
const getLastQuote = require('../getLastQuote')

const twentyForty = async (ticker) => {
    const position = await getPosition(ticker)
    const symbol = position.symbol
    const qty = parseInt(position.qty)
    const avgPrice = position.avg_entry_price

    const lastQuote = await getLastQuote(ticker)
    const askPrice = lastQuote.last.askprice

    // 20-40
    if (askPrice !== undefined && (askPrice >= (1.2 * avgPrice))) {
        const sellPrice = 1.2 * avgPrice
        const sellAmt = 0.4 * qty
        sellLimit({ symbol, sellPrice, sellAmt })
        sellStop({ symbol, sellPrice, sellAmt })
    }
    // 40-80
    if (askPrice !== undefined && (askPrice >= (1.4 * avgPrice))) {
        const sellPrice = 1.4 * avgPrice
        const sellAmt = 0.8 * qty
        sellLimit({symbol, sellPrice, sellAmt})
        sellStop({symbol, sellPrice, sellAmt})
    }
}

module.exports = twentyForty