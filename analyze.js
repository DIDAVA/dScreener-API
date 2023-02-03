const fs = require('fs')
const data = JSON.parse(fs.readFileSync('./opportunities.json'))
const list = Object.values(data)

const keys = ['1m', '5m', '15m', '1H', '4H', '1D', '1W', '1M']
const max = [1,5,15,60,240,1440].reduce((a, b) => a + (100 * b / 1440), 0)
console.log(max)
const parse = num => {
  return parseFloat(num.toFixed(2))
}

const result = []
list.forEach(a => {
  a.list.forEach(b => {
    if (b.sym == 'SHIB') {
      b.rsi.forEach((r, i) => b[keys[i]] = parse(r))
      delete b.rsi
      delete b.avg
      let wgt = b['1D']
      wgt += b['4H'] * (240 / 1440)
      wgt += b['1H'] * (60 / 1440)
      wgt += b['15m'] * (15 / 1440)
      wgt += b['5m'] * (5 / 1440)
      wgt += b['1m'] * (1 / 1440)
      b.drsi = parse(wgt / max * 100)
      b.ts = a.date
      result.push(b)
    }
  })
})
console.table(result)