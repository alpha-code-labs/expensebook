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

dotenv.config();
const app = express();

const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} environment`);
const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS);
const rabbitMQUrl = process.env.rabbitMQUrl;
const mongoURI = process.env.MONGODB_URI;

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

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectToMongoDB();

app.use((err, req, res, next) => {
  handleErrors(err, req, res, next);
});

const port = process.env.PORT || 8098;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// start consuming messages..
startConsumer('reporting');





