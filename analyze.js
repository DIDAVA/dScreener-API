const fs = require('fs')
const data = JSON.parse(fs.readFileSync('./opportunities.json'))
const list = Object.values(data)

const keys = ['1m', '5m', '15m', '1H', '4H', '1D', '1W', '1M']
const parse = num => {
  return parseFloat(num.toFixed(2))
}

const result = []
list.forEach(a => {
  a.list.forEach(b => {
    if (b.sym == 'LUNA') {
      b.avg = parse(b.avg)
      b.rsi.forEach((r, i) => b[keys[i]] = parse(r))
      delete b.rsi
      b.ts = a.date
      result.push(b)
    }
  })
})
console.table(result)