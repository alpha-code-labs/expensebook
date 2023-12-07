import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import nodeCron from 'node-cron';
import dotenv from 'dotenv';
import { config } from './config.js';
import approvalRoutes from './routes/dataSaveRoutes.js';
import travelApprovalRoutes from './routes/travelApprovalRoutes.js';
import travelExpenseApprovalRoutes from './routes/travelExpenseApprovalRoutes.js';
import nonTravelExpenses from './routes/nonTravelExpense.js';
import cashAdvance from './routes/cashAdvance.js';
import { errorHandler } from './errorHandler/errorHandler.js';


// Load environment variables using dotenv
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const databaseURI = config[environment].mongoURI; 
const castStrings = config[environment].castStrings;
console.log(`Running in ${environment} environment`);
console.log(`Database URI: ${config[environment].mongoURI}`);

const mongoURI = process.env.mongoURI;

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

//Routes
app.use('/api/approvals', approvalRoutes); // dummy data
app.use('/approvals/tr-ca', travelApprovalRoutes);
app.use('/approvals/cash', cashAdvance);
app.use('/travelExpense',travelExpenseApprovalRoutes);
app.use('/approvals/expense', nonTravelExpenses);

/// Start the batch job
//startBatchJob();

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


// Use the errorHandler middleware at the end
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
