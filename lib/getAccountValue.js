require('dotenv').config();
const Alpaca = require('@alpacahq/alpaca-trade-api')

const alpacaInstance = new Alpaca({
  keyId: process.env.APIKEY,
  secretKey: process.env.SECRET,
  paper: true,
  usePolygon: false
})


const getAccountValue = async () => {
    try {
        return await alpacaInstance.getAccount()
    }
    catch(e) {
        console.log('error: ', e)
    }
};

module.exports = getAccountValue;
