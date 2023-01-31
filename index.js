const fs = require('fs')
const axios = require('axios')
const tv = axios.create()
const {Server} = require('socket.io')
const port = 8000
const io = new Server({
  cors: {
    origin: "http://localhost:8080 https://screener.didava.ir",
    methods: ["GET", "POST"]
  }
})

const filter = require('./filter')
const process = data => {
  const list = []
  data.forEach(item => {
    const symbol = item.d[0]
    if (filter.swap.includes(symbol)) {
      const rsi = item.d.slice(14, 20)
      const fil = rsi.filter(i => typeof i == 'number')
      const sum = fil.reduce((a,b) => a + b, 0)
      const avg = sum / fil.length
      const min = Math.min(...rsi)
      const max = Math.max(...rsi)
      if (min >= 75) list.push({sym: symbol, side: 'sell', close: item.d[3], avg, rsi})
      if (max <= 25) list.push({sym: symbol, side: 'buy', close: item.d[3], avg, rsi})
    }
  })
  if (list.length) {
    const file = `./opportunities.json`
    let oppotunities = {}
    if (fs.existsSync(file)) oppotunities = JSON.parse(fs.readFileSync(file))
    const date = new Date().toLocaleString()
    const ts = Date.now()
    oppotunities[ts] = {date, list}
    fs.writeFileSync(file, JSON.stringify(oppotunities, null, 2))
  }
}

const getPayload = () => {
  return JSON.parse(fs.readFileSync('./payload.json'))
}

let cache = {}
const fetch = () => {
  tv.post('https://scanner.tradingview.com/coin/scan', getPayload())
  .then(resp => {
    cache = resp.data
    io.emit('data', resp.data)
    process(resp.data.data)
  })
  .catch(err => {
    console.error(err.message)
  })
}

const main = () => {
  io.on('connection', socket => {
    socket.emit('welcome')
    socket.emit('payload', getPayload())
    socket.emit('data', cache)
  })
  io.listen(port)
  console.log('Server listening on port', port)
  fetch()
  setInterval(() => fetch(), 10000)
}

main()