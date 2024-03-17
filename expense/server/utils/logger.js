import pino from 'pino';
import pinoPretty from 'pino-pretty';

function createLogger(isDevelopment) {
 const transport = pino.transport({
    targets: [
      {
        target: 'pino/file',
        options: {
          destination: './logs/app.log',
          // Example of log rotation configuration
          // options: { size: '100M', interval: '1d' }
        },
      },
      {
        target: isDevelopment ? 'pino-pretty' : 'pino/file',
        options: {
          target: 'pino-pretty',
          options: {
            colorize: true, // Prettify logs in development
            // Additional options for pino-pretty
            timestamp: pino.stdTimeFunctions.isoTime, // Add timestamps
            translateTime: true, // Translate timestamps to local time
            levelFirst: true, // Place the log level at the beginning of the log line
            messageKey: 'msg', // Use 'msg' as the key for log messages
            errorProps: '*', // Include all error properties in the log
            ignore: 'pid,hostname', // Exclude 'pid' and 'hostname' from the log
            safe: true, // Ensure log messages are safe to use in all environments
          },
        },
      },
    ],
 });

 const logger = pino({
    transport,
    level: 'debug',
 });

 return logger;
}

const isDevelopment = process.env.NODE_ENV === 'development';
export default createLogger(isDevelopment);
