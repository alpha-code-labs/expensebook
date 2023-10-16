import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {config} from './config.js';
import frontendRoutes from './routes/frontendRoutes.js'

dotenv.config();

const environment = process.env.NODE_ENV || 'development'
const databaseURI = config[environment].mongoURI
const castStrings = config[environment].castStrings
console.log(`Running in ${environment} environment`);
console.log(`Database URI: ${config[environment].mongoURI}`);

const mongoURI = process.env.mongoURI

const app =express()



app.use(bodyParser.json())
app.use(cors())

app.use('/cash-advance/api',frontendRoutes) //cashAdvanceRoutes

const mongodb = async ()=>{
    try{
        await mongoose.connect(mongoURI,{
            useNewUrlParser: true,
            useUnifiedTopology:true
        }).then(
            
        )
        console.log('You are connect to MongoDB')

    }catch(error){
        console.error('Error connecting to MongoDB',error)

        

    }

}

mongodb()


const port = process.env.PORT || 8080

app.listen(port ,()=>{
    console.log(`Server is running on ${port}`);
})

