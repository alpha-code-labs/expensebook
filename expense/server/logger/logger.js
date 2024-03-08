// import pino from 'pino';
// import fs from 'fs';
// import path from 'path';

// // Get the current module's directory using __filename
// const currentModuleDir = path.dirname(new URL(import.meta.url).'C:\Users\hp\Desktop\acl\expense_dev\server\logger\logs');

// // Create a logs directory if it doesn't exist
// const logsDir = path.join(currentModuleDir, 'logs');
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir, { recursive: true });
// }

// const logger = pino({
//   prettyPrint: { colorize: true },
// });

// // Define a custom log file with date and time
// const logFileName = `log_${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
// const logFilePath = path.join(logsDir, logFileName);
// const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// // Use pino's `destination` option to log to both console and file
// const loggerWithFile = logger.destination(1, logStream);

// export default loggerWithFile;
