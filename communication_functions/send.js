const dgram = require('dgram')

const sendUDPMessage = (sendBuffer, UDP_SERVER_IP, UDP_SEND_PORT) => {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4')
        client.send(sendBuffer, 0, sendBuffer.length, UDP_SEND_PORT, UDP_SERVER_IP, (err, bytes) => {
            if (err) {
                console.log("Error in sending message", err)
                reject(err)
            }
            // console.log(`\x1b[30m\x1b[43m==> [${UDP_SERVER_IP}:${UDP_SEND_PORT}] -- ${sendBuffer} (Message Length: ${sendBuffer.length})\x1b[0m\n`)
            client.close()
            resolve()
        })
    })
}

module.exports = {
    sendUDPMessage
}