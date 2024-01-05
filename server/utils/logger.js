import pino from 'pino'
import fs from 'fs'

const logger = pino({})

// Specify the file where you want to store logs
const logFilePath = 'app.log';

// Create a write stream to the log file
const logFileStream = fs.createWriteStream(logFilePath, { flags: 'a' });


export {logger}
