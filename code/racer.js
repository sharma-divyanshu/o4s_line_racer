const { receiveUDPMessage } = require('../communication_functions/receive')
const { sendUDPMessage } = require('../communication_functions/send')

const RACER_UDP_IP = process.env.RACER_UDP_IP
const UDP_RECEIVE_PORT = process.env.UDP_RECEIVE_PORT
const UDP_SEND_PORT = process.env.UDP_SEND_PORT
const UDP_SEND_IP = process.env.UDP_SEND_IP

intervalRefreshFlag = false
refreshInterval = null
timeout = null

receiveUDPMessage.on('message', (message, rinfo) => {

    // Calculate value of y-coordinate
    const calculateY = (slope, constant) => {
        return (slope * x + constant) + ''
    }

    // Increment value of x-coordinate
    const incrementX = (slope, constant) => {
        intervalRefreshFlag = true
        x += 1
        sendUDPMessage(calculateY(slope, constant), UDP_SEND_IP, UDP_SEND_PORT, (err, messageSent) => {
            if (err) console.log("Error")
        })
        return
    }

    const accurateInterval = (func, interval) => {
        var clear, nextAt, wrapper, now;
        clearTimeout(timeout)
        now = new Date().getTime() + interval;
        nextAt = now;
        timeout = null;
        wrapper = wrapper = () => {
            var scheduledTime = nextAt;
            nextAt += interval;
            timeout = setTimeout(wrapper, nextAt - new Date().getTime());
            func(scheduledTime);
        };
        clear = clear = () => {
            return clearTimeout(timeout);
        };
        timeout = setTimeout(wrapper, nextAt - new Date().getTime()); 
        return {
            clear: clear
        };
    };

    x = 0
    
    if (message.toString() === 'x,x') {
        // Kill process
        process.exit(0)
    } else {
        var messageParams = message.toString().split(',')
        console.log(`\x1b[33m${process.env.NAME} <== [${Date.now()} --- ${rinfo.address}:${rinfo.port}] -- ${message}\x1b[0m`)
        let slope = parseInt(messageParams[0])
        let constant = parseInt(messageParams[1])
        // Set 50ms location updater
        accurateInterval(() => incrementX(slope, constant), 50)
    }
})

// Bind to UDP socket
receiveUDPMessage.bind(UDP_RECEIVE_PORT, RACER_UDP_IP, () => {
    console.log(`${process.env.NAME} listening on ${receiveUDPMessage.address().address} and port ${receiveUDPMessage.address().port}`)
})