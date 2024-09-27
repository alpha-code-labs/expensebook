import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import nodeCron from 'node-cron';
import dotenv from 'dotenv';
import { mainFrontendRoutes } from './routes/mainFrontendRoutes.js';
import { handleErrors } from './errorHandler/errorHandler.js';
import { startConsumer } from './rabbitmq/consumer.js';
import {runApproveToNextState} from './scheduler/approvedToNextState.js';
import { travelPolicyValidation } from './controller/travelExpenseController.js';
import { scheduleTripTransitBatchJob } from './batchJobs/upcomingToTransit.js';
import Expense from './models/tripSchema.js';
import Reimbursement from './models/reimbursementSchema.js';
import { getExpenseCategoryFields } from './ocr/categoryFields.js';
import { calculateTotalCashAdvances } from './rabbitmq/messageProcessor.js/finance.js';
// import logger from './logger/logger.js';

// test
// logger.info('This is an info message from another file');
// logger.error('This is an error message from another file');

// logger
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


// Start the batch job
runApproveToNextState()
scheduleTripTransitBatchJob()

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
startConsumer("expense");

// (async () => {
//   try {
//       const tenantId = '65f7d5442f8fdd7d542eed07';
//       const empId = '1017';
//       const travelType = 'domestic';
//       const categoryName = 'Travel Insurance';
//       const travelClass = 'Business';
//       const totalAmount = 80;
//       console.log("policy validation testing .....");

//       const result = await travelPolicyValidation(tenantId, empId, travelType, categoryName, totalAmount, travelClass);
//       if (result) {
//           console.log("policy validation testing output", result);
//           return result;
//       }
//   } catch (error) {
//       console.error(error);
//   }
// })();


// ( async() =>{
//   try{
//     const tenantId = '660a58ac1a308ce97b32213f'

// //    const res = await Reimbursement.find({tenantId})
// //     console.log("return from db", res);
// //     const maxIncrementalValue = await Reimbursement.findOne({ tenantId }, 'expenseReimbursementSchema.expenseHeaderNumber')
// //     .sort({ 'expenseReimbursementSchema.expenseHeaderNumber': -1 })
// //     .limit(1);

// // console.log("maxIncrementalValue from db", maxIncrementalValue);
// // const res = await Reimbursement.find({ tenantId });
// // console.log("return from db", res);
// // const maxIncrementalValue = await Reimbursement.findOne({ tenantId })
// //     .sort({ expenseHeaderNumber: -1 }) 
// //     .limit(1)
// //     .select('expenseHeaderNumber');
// const maxIncrementalValue = await Expense.findOne({tenantId}, 'travelExpenseData.expenseHeaderNumber')
//     .sort({ 'travelExpenseData.expenseHeaderNumber': -1 })
//     .limit(1)
//     .select('travelExpenseData.expenseHeaderNumber'); 

//     console.log("maxIncrementalValue from db", maxIncrementalValue);

// const nextIncrementalValue = maxIncrementalValue?.expenseHeaderNumber ? parseInt(maxIncrementalValue.expenseHeaderNumber.substring(6), 10) : 0;


// console.log("nextIncrementalValue", nextIncrementalValue);
//   }catch(error){
//     console.error(error)
//   }
// })()

// const tenantId = '66e048c79286e2f4e03bdac1'
// const travelType = 'international'
// const expenseCategory = 'hotel'
// const report = await Expense.findOne({"tripId":"66e296fc272686d0070db91f"})
// if(report){
//   const {cashAdvancesData, expenseAmountStatus} = report
//   // console.log("cashAdvancesData hamlet ---", cashAdvancesData?.length , JSON.stringify(report,'',2))
//   console.log("cashAdvancesData hamlet ---",expenseAmountStatus, cashAdvancesData?.length , report)

//  const data = await calculateTotalCashAdvances(tenantId,cashAdvancesData)
//  console.log("data", JSON.stringify(data,'',2))
// }

// getExpenseCategoryFields(tenantId, travelType, expenseCategory) 

// const theCount =await Reimbursement.countDocuments({tenantId})

// console.log("the count", theCount)

// const formatTenant = (companyName) => {
//   return companyName.toUpperCase(); 
// };

// const generateIncrementalNumber = (companyName, incrementalValue) => {
//   if (typeof companyName !== 'string' || typeof incrementalValue !== 'number') {
//     throw new Error('Invalid input parameters');
//   }
//   console.log("companyName",companyName, "incrementalValue", incrementalValue)
//   const formattedTenant = formatTenant(companyName).substring(0, 2);
//   const paddedIncrementalValue = (incrementalValue !== null && incrementalValue !== undefined && incrementalValue !== 0) ?
//     (incrementalValue + 1).toString().padStart(6, '0') :
//     '000001';

//   return `RE${formattedTenant}${paddedIncrementalValue}`;
// }

// console.log("the number", generateIncrementalNumber('quantum',theCount)
// )



