const accounting = require('accounting')

module.exports = (value) => {
  return accounting.formatMoney(value, process.appConfig.currency.symbol, process.appConfig.currency.cent, process.appConfig.currency.thousand, process.appConfig.currency.decimal);
}