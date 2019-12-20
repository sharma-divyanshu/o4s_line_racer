'use strict'

const fs = require('fs')
const { sendUDPMessage } = require("../communication_functions/send")
const { receiveUDPMessage } = require("../communication_functions/receive")

const UDP_SEND_IP_R1 = process.env.UDP_SEND_IP_R1
const UDP_SEND_IP_R2 = process.env.UDP_SEND_IP_R2
const UDP_SEND_PORT = process.env.UDP_SEND_PORT
const UDP_RECEIVE_PORT = process.env.UDP_RECEIVE_PORT
const UDP_RECEIVE_IP = process.env.UDP_RECEIVE_IP
const RACER_IP = [UDP_SEND_IP_R1, UDP_SEND_IP_R2]

let logArray = []

let stepCounter = 0
let lapCounter = 0

let lapStartTime = 0
let R1lapStartTime = 0
let R2lapStartTime = 0

let slope = []
let constant = []

let R1_y = 0
let R2_y = 0

let R1Flag = false
let R2Flag = false

let averageLatencyR1 = 0
let averageLatencyR2 = 0

const startNewLap = () => {
    
    // Generate random coordinates between (0, 10)
    const generateRandom = () => {
        return Math.floor(Math.random() * 10)
    }

    // Initialize slope and constant values
    slope = [generateRandom(), generateRandom()]
    constant = [generateRandom(), generateRandom()]
    
    // Reset average latency values
    averageLatencyR1 = 0
    averageLatencyR2 = 0
    // Reset step counter
    stepCounter = 0

    // Check if both lines have same slope
    if (slope.every(value => value === slope[0])) {
        slope[1] += 1
    }

    // Send new values to racers
    lapInitiation(slope, constant)
}

const lapInitiation = (slope, constant) => {

    // Store lap start time
    lapStartTime = Date.now()
    // Send new lap message to racers
    let promiseArray = RACER_IP.map((element, index) => sendUDPMessage(slope[index] + "," + constant[index], element, UDP_SEND_PORT))
    // Store lap start times for each racer
    promiseArray[0]
        .then(() => R1lapStartTime = Date.now())
        .catch(e => console.log("Error sending to R1", e))
    promiseArray[1]
        .then(() => R2lapStartTime = Date.now())
        .catch(e => console.log("Error sending to R2", e))
}

receiveUDPMessage.on('message', (message, rinfo) => {

    // Call on completion of one unit movement by both racers
    const completeIncrement = () => {
        // Increment step counter
        stepCounter += 1
        let distance = Math.abs(R1_y - R2_y)
        // Check if distance is more than 10 units
        if (distance >= 10) {
            // Increment lap counter
            lapCounter += 1
            logArray.push([lapCounter, slope[0], constant[0], slope[1], constant[1], lapStartTime, Date.now(), Date.now() - lapStartTime, averageLatencyR1.toFixed(2), averageLatencyR2.toFixed(2)])
            // If less than 10 laps, start a new lap
            if (lapCounter < 10) {
                startNewLap()
            }
            // If more than 10 laps, kill racer processes and log lap times
            else {
                logArray.sort((a, b) => a[7] - b[7])
                let stringArray = logArray.map(element => `${element[0]}. [(${element[1]}, ${element[2]}), (${element[3]}, ${element[4]})], ${element[5]}, ${element[6]}, ${element[7]}, ${element[8]}, ${element[9]}` + '\n')
                let writeString = stringArray.reduce((total, current) => total + current, '')
                // Send message to kill racers
                RACER_IP.forEach(value => sendUDPMessage('x,' + 'x', value, UDP_SEND_PORT))
                // Output log
                fs.writeFile('../master.log', writeString, (err) => {
                    if (err) console.log("Error writing logs", err)
                    console.log(writeString)
                })
            }
        }
        R1Flag = false
        R2Flag = false
    }

    // Check which racer the message is from, call completeIncrement() after receiving POS messages from both
    if (rinfo.address === UDP_SEND_IP_R1) {
        R1_y = parseInt(message)
        let currentLatencyR1 = Date.now() - R1lapStartTime - 50 * (stepCounter + 1)
        // Calculate average latency
        averageLatencyR1 = (averageLatencyR1 * (stepCounter) + currentLatencyR1) / (stepCounter + 1)
        R1Flag = true
        if (R2Flag) completeIncrement()
    } else {
        R2_y = parseInt(message)
        let currentLatencyR2 = Date.now() - R2lapStartTime - 50 * (stepCounter + 1)
        // Calculate average latency
        averageLatencyR2 = (averageLatencyR2 * (stepCounter) + currentLatencyR2) / (stepCounter + 1)
        R2Flag = true
        if (R1Flag) completeIncrement()
    }
})

// Bind to UDP socket
receiveUDPMessage.bind(UDP_RECEIVE_PORT, UDP_RECEIVE_IP, () => {
    console.log(`Master listening on ${receiveUDPMessage.address().address} and port ${receiveUDPMessage.address().port}`)
    startNewLap()
})