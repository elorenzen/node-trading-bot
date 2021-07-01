require('dotenv').config();
const Alpaca = require('@alpacahq/alpaca-trade-api')

const alpacaInstance = new Alpaca({
  keyId: process.env.APIKEY,
  secretKey: process.env.SECRET,
  paper: true,
  usePolygon: false
})


const getAllPositions = async () => {
    try {
        return await alpacaInstance.getPositions()
    }
    catch(e) {
        console.log('error: ', e)
    }
};

module.exports = getAllPositions;
