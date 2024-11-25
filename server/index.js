import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import approvalRoutes from './routes/dataSaveRoutes.js';
import travelApprovalRoutes from './routes/travelApprovalRoutes.js';
import travelExpenseApprovalRoutes from './routes/travelExpenseApprovalRoutes.js';
import cashAdvance from './routes/cashAdvance.js';
import { errorHandler } from './errorHandler/errorHandler.js';
import startConsumer from './rabbitmq/consumer.js'
import { closeMongoDBConnection, connectToMongoDB } from './db/db.js';
import { closeRabbitMQConnection, getRabbitMQConnection } from './rabbitmq/connection.js';

const environment = process.env.NODE_ENV == 'prod' ? '.env.prod' :'.env';
dotenv.config({path:environment});

console.log(`Running in ${environment} environment`);

const app = express();

const port = process.env.PORT || 8085;
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

// middleware
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/approvals', approvalRoutes); // dummy data
app.use('/api/fe/approvals/tr-ca', travelApprovalRoutes);
app.use('/api/fe/approvals/cash', cashAdvance);
app.use('/api/fe/approvals/expense',travelExpenseApprovalRoutes);
app.use((req,res,next) => {
  res.status(404).json({success: false, message:'Wrong Route,Please check url'})
})

app.get('/get',(req,res) => res.status(200).json({message:"Approval microservice is live"}))


// Use the errorHandler middleware at the end
app.use(errorHandler);


const initializeServer = async () => {
  try {
      await Promise.all([
        connectToMongoDB(),
        getRabbitMQConnection(),
        startConsumer('approval')
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





