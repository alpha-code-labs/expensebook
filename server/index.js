import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { handleErrors } from './errorHandler/errorHandler.js';
import { startConsumer } from "./rabbitmq/consumer.js";
import router from "./routes/mainFrontendRouter.js";
import { closeRabbitMQConnection, getRabbitMQConnection } from "./rabbitmq/conncection.js";
import { closeMongoDBConnection, connectToMongoDB } from "./db/db.js";

dotenv.config()
const app = express();

const MONGO_URI = process.env.NODE_ENV == 'production' ? process.env.COSMOSDB_URI : process.env.MONGODB_URI;

const port = process.env.PORT || 8009;

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
console.log(`mongoURI - ${MONGO_URI} `);
app.use(express.json());
app.use(cors());

app.use("/api/fe/finance", router)
app.use((req,res,next) =>{
  res.status(404).json({success:false, message:"Wrong route. Please check the URL."})
})
app.use(handleErrors);


const initializeServer = async () => {
  try {
      await Promise.all([
        connectToMongoDB(),
        getRabbitMQConnection(),
        startConsumer('finance')
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





