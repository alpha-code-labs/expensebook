import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import tripRoutes from './routes/tripRoutes.js';
import { mainRouter } from './routes/mainFrontendRoutes.js';
import { handleErrors } from './errorHandler/errorHandler.js';
import { startConsumer } from './rabbitmq/consumer.js';
import HRCompany from './models/hrCompanySchema.js';
import cookieParser from 'cookie-parser';
import { closeRabbitMQConnection, getRabbitMQConnection } from './rabbitmq/connection.js';
import { closeMongoDBConnection, connectToMongoDB } from './db/db.js';
import REIMBURSEMENT from './models/reimbursementSchema.js';
import { deleteReimbursement } from './rabbitmq/messageProcessor/reimbursement.js';
import { getEmployeeIdsByDepartments } from './utils/functions.js';

dotenv.config();
const app = express();

const port = process.env.PORT || 8098;

let server;
let shutdownInProgress = false;

const shutdown = async (reason) => {
  try {
      if (shutdownInProgress) {
          console.log('Shutdown already in progress...');
          return;
      }

      shutdownInProgress = true;
      console.log(`Shutdown initiated: ${reason}`);

      const cleanupTasks = [];

      if (typeof closeRabbitMQConnection === 'function') {
          cleanupTasks.push(
              closeRabbitMQConnection()
                  .then(() => console.log('RabbitMQ connection closed'))
                  .catch(err => console.error('RabbitMQ cleanup error:', err))
          );
      }

      cleanupTasks.push(
          closeMongoDBConnection()
              .then(() => console.log('MongoDB connection closed'))
              .catch(err => console.error('MongoDB cleanup error:', err))
      );

      if (server) {
          cleanupTasks.push(
              new Promise((resolve) => {
                  server.close(() => {
                      console.log('Server connections closed');
                      resolve();
                  });
              })
          );
      }

      const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Shutdown timeout')), 10000)
      );

      await Promise.race([
          Promise.allSettled(cleanupTasks),
          timeoutPromise
      ]);

      console.log('Cleanup completed');
      process.exit(0);
  } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
  }
};

const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} environment`);
const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS);


// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       return callback(new Error('CORS policy violation: Origin not allowed'), false); 
//     }
//     return callback(null, true);
//   },
//   credentials: true
// }

const corsOptions = {
    origin: '*',
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

//Routes
app.use('/api', tripRoutes);
app.use(mainRouter);
app.use((req,res,next) =>{
  res.status(404).json({success:false, message:"Wrong route. Please check the URL."})
})
app.use(handleErrors);
app.get('/test', (req,res) => { return res.status(200).json({message:'Reporting microservice is live'})})

// const connectToMongoDB = async () => {
//   try {
//     await mongoose.connect(mongoURI);
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// };

// connectToMongoDB();

app.use((err, req, res, next) => {
  handleErrors(err, req, res, next);
});




const initializeServer = async () => {
  try {
      await Promise.all([
        connectToMongoDB(),
        getRabbitMQConnection(),
        startConsumer('reporting')
      ])

      server = app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
      });

      server.on('error', (error) => {
          console.error('Server error:', error);
          shutdown('Server error').catch(console.error);
      });

  } catch (error) {
      console.error('Initialization error:', error);
      shutdown('Initialization failure').catch(console.error);
  }
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('Unhandled Rejection').catch(console.error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown('Uncaught Exception').catch(console.error);
});

process.on('SIGTERM', () => shutdown('SIGTERM').catch(console.error));
process.on('SIGINT', () => shutdown('SIGINT').catch(console.error));

// Start the server
initializeServer().catch(console.error);


// const datas = await deleteReimbursement({"expenseHeaderId":"6707cf303997100189957049"})
// console.log("what data", datas)
// const data = await REIMBURSEMENT.find({"expenseHeaderId":"6707cf303997100189957049"})
// console.log("data", JSON.stringify(data,'',2))
// const getEmpIds = await getEmployeeIdsByDepartments(
//     "66e048c79286e2f4e03bdac1",
//     "1005",
//     ["Finance"]
//   );

//   console.log("Finance .....",getEmpIds)