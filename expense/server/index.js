import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import nodeCron from 'node-cron';
import dotenv from 'dotenv';
import { config } from './config.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { handleErrors } from './errorHandler/errorHandler.js';
import  triggerBatchJobRoutes  from './routes/triggerBatchJobRoutes.js';
import expenseReportRoutes from './routes/expenseReportRoutes.js';
import modifyExpenseRouter from './routes/modifyExpenseReportRoutes.js';
import nonTravelExpenseReport from './routes/nonTravelExpenseRoutes/nonTravelExpenseReportRoutes.js';
// import { applyTenantFilter } from './middleware/tenantMiddleware.js';

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
// app.use('/api/:tenantId/*', applyTenantFilter);

//Routes
app.use('/api/expense',  expenseRoutes);
app.use('/api/expense/update', expenseReportRoutes);
app.use('/api/expense/m', modifyExpenseRouter);
app.use('/api/expense/non_travel', nonTravelExpenseReport);


//Routes batchJobs
app.use('/expense/trigger', triggerBatchJobRoutes);


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



// Error handling middleware - Should be the last middleware
app.use((err, req, res, next) => {
  handleErrors(err, req, res, next);
});

const port = process.env.PORT || 8083;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
