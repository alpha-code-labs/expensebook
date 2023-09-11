import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import nodeCron from 'node-cron';
import dotenv from 'dotenv';
import nodemon from 'nodemon';

//Load env variables
dotenv.config();

const mongoURI = process.env.MONGODB_URI 

const app = express();

//middleware
app.use(bodyParser.json());
app.use(cors());

const mongodb = async () => {
    try{
        await mongoose.connect(mongoURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('You are Connected to Mongodb');
    } catch(error){
        console.error('Error connecting to Mongodb:', error)
    }
    
};

mongodb();

const port = process.env.PORT || 9000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});