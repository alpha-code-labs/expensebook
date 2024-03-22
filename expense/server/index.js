import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import nodeCron from 'node-cron';
import dotenv from 'dotenv';
import { mainFrontendRoutes } from './routes/mainFrontendRoutes.js';
import { handleErrors } from './errorHandler/errorHandler.js';
import { startConsumer } from './rabbitmq/consumer.js';
import { reportingRouter } from './routes/reportingRoutes.js';
import {runApproveToNextState} from './scheduler/approvedToNextState.js';
// import logger from './logger/logger.js';

//test
// logger.info('This is an info message from another file');
// logger.error('This is an error message from another file');

// // logger
// logger.info('This is an info message from expense');
// logger.error('This is an error message from expense');


// Load environment variables using dotenv
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} environment`);

const mongoURI = process.env.mongoURI;

const app = express();

// middleware
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/fe/expense', mainFrontendRoutes);
app.use('/api/report', reportingRouter);


/// Start the batch job
// runApproveToNextState()

app.get('/test', (req,res) =>{
  res.send('welcome to alpha code labs ')
})

const mongodb = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('You are Connected to Mongodb');
  } catch (error) {
    console.error('Error connecting to Mongodb:', error);
  }
};

mongodb();


// Error handling middleware - Should be the last middleware
app.use((err, req, res, next) => {
  handleErrors(err, req, res, next);
});

const port = process.env.PORT || 8083;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//RabbitMq
// startConsumer("expense");
