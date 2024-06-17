import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import cashAdvanceRouter from "./routes/cashAdvanceRouter.js";
import travelExpenseRouter from "./routes/travelExpenseRouter.js";
import reimbursementRouter from "./routes/reimbursementRouter.js";
import financeRouter from "./routes/financeRouter.js";
import { handleErrors } from './errorHandler/errorHandler.js';
import { startConsumer } from "./rabbitmq/consumer.js";

dotenv.config()
const app = express();

const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} environment`);
const rabbitMQUrl = process.env.rabbitMQUrl;
const mongoURI = process.env.MONGODB_URI;

// import Product from './models/cashAdvance';
// import { find } from "./models/cashAdvance";

app.use(express.json());

//finding cash advances with actionedUpon flag as No
// app.get("/cashadvance", async (req, res) => {
//   try {
//     const cashadvances = await find({ actionedUpon: "No" });

//     // Extracting empId and name from each approver and storing in separate variables
//     /*const cashAdvancesWithApprovers = cashadvances.map((cashadvance) => {
//       const empIds = cashadvance.approvers.map((approver) => approver.empId);
//       const names = cashadvance.approvers.map((approver) => approver.name);

//       return {
//         ...cashadvance._doc,
//         empIds: empIds,
//         names: names,
//       };
//     });*/
//     /*
//       const Finance = require('./models/Finance');
//       // Insert the data into the 'finance' collection
//       const result = await Finance.insertMany(cashadvances);*/
//     //const financeData = await Finance.find({});
//     res.status(200).json({
//         cashadvances
//       //cashAdvances: cashAdvancesWithApprovers,
//       //financeData: financeData,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

//modify status when marked as settled
// app.put("/cashadvance", async (req, res) => {
//   try {
//     const cashadvance = await Cash.findOneAndUpdate(
//       /*id,*/
//         { $set: { settlementFlag: true } }, // Update only the cashAdvanceStatus field
//         { new: true } // To return the updated document
//       // id,
//       // req.body
//     );

//     if (!cashadvance) {
//       return res.status(404).json({ message: `Element not found` });
//     }
//     const updatedcashadvance = await Cash.findById(id);
//     res.status(200).json(updatedcashadvance);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message });
//   }
// });












// 09/01/24
app.use(cors());
app.use("/api/cashAdvance" , cashAdvanceRouter);
app.use("/api/travelExpense" , travelExpenseRouter);
app.use("/api/reimbursement" , reimbursementRouter);
app.use("/api/finance" , financeRouter);


const connectToMongoDB = async () => {
try{
  await mongoose.connect(mongoURI);
} catch(error){
    console.error('error connecting to mongodb', error)
}
};

connectToMongoDB()

app.use((err, req, res, next) => {
    handleErrors(err, req, res, next);
  });
  
  const port = process.env.PORT || 8098;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
  // start consuming messages..
  startConsumer('finance');





