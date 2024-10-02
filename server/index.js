import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import pino from 'pino';
import signup from './controllers/signup.js';
import otp from './controllers/otp.js';
import password from './controllers/update_password.js';
import companyName from './controllers/companyName.js';
import login from './controllers/login.js';
import forgotPassword from './controllers/forgotPassword.js';
import updateEmployee from "./controllers/updateEmployee.js";
import updateHRCompany from "./controllers/hrMaster.js";
import employeeRoles from "./controllers/employeeRoles.js";
import hrData from './controllers/companyHr.js';
import startConsumer from "./controllers/rabbitMQ/consumer.js";
import cookieParser from "cookie-parser";

const logger = pino({})
logger.info('Hello World')

dotenv.config();
const app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://kv082321:kv082321@expensebookingai.capxa3k.mongodb.net/logindb?retryWrites=true&w=majority'
const PORT = process.env.PORT||9004
// app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
// app.use(cors({ origin: 'http://localhost:7002', credentials: true }));


app.get('/ping', async (req, res)=>{
    res.status(200).json({message: 'It\'s Chilling in here'})
})

app.use("/api", signup);
app.use("/api", otp);
app.use("/api", password);
app.use("/api", companyName);
app.use("/api", login);
app.use("/api", forgotPassword);
app.use("/api", updateEmployee);
app.use("/api", updateHRCompany);
app.use("/api", employeeRoles);

// app.use("/api",hrData)

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URI, {});
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  } catch (error) {
    console.error(`${error} did not connect`);
  }
}

await connectToMongoDB();
// await startConsumer('login');
