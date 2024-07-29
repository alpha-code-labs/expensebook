import pino from 'pino';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const logFilePath = join(__dirname, 'logs', 'app.log');

const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: logFilePath }
});

const consoleTransport = pino.transport({
  target: 'pino-pretty',
  options: { colorize: true }
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.multistream([
    { stream: fileTransport },
    { stream: consoleTransport }
  ])
);

export default logger;