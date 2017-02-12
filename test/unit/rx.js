if (process.env.RX === '4') {
  module.exports = require('rx') // RxJS 4
} else {
  module.exports = require('rxjs') // RxJS 5
}
