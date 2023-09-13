import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import * as dotenv from 'dotenv'

import hrCompanyRoutes from './routes/hrCompanyRoutes.js'
import accountlineRoute from './routes/accountLineRoute.js'

const app = express()
dotenv.config()

app.use(bodyParser.json({limit:"30mb", extended: true}))
app.use(bodyParser.urlencoded({limit:"30mb", extended: true}))
app.use(cors())

// Routes
app.use('/api', hrCompanyRoutes) //  HRCompany route
app.use('/api', accountlineRoute) //accountLIneRoute


const CONNECTION_URL = process.env.CONNECTION_URL
const PORT =process.env.PORT || 5000

mongoose.connect(CONNECTION_URL,{useNewUrlParser: true, useUnifiedTopology:true})
.then(()=> app.listen(PORT,()=> console.log(`Server running on port:${PORT} `)))
.catch((error) =>console.log(error.message))






