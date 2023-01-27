const axios = require('axios')
const tv = axios.create()
const {Server} = require('socket.io')
const port = 8000
const io = new Server({
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
})

const valid = require('./filter')
const payload = require('./payload')
let cache = {}
const fetch = () => {
  tv.post('https://scanner.tradingview.com/coin/scan', payload)
  .then(resp => {
    resp.data.data = resp.data.data.filter(i => valid.includes(i.d[0]))
    cache = resp.data
    io.emit('data', resp.data)
  })
  .catch(err => {
    console.error(err.message)
  })
}

const main = () => {
  io.on('connection', socket => {
    socket.emit('welcome')
    socket.emit('payload', payload)
    socket.emit('data', cache)
  })
  io.listen(port)
  console.log('Server listening on port', port)
  fetch()
  setInterval(() => fetch(), 10000)
}

main()