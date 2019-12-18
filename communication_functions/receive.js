const dgram = require('dgram')
const server = dgram.createSocket('udp4')

server.on('listening', () => {
})

server.on('close', () => {
    console.log("UDP server closed")
})

server.on('error', (err) => {
    console.log("UDP connectivity port encountered error", err)
})

module.exports = {
    receiveUDPMessage: server
}