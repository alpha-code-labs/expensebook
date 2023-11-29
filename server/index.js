import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import frontendRoutes from './routes/frontendRoutes.js';

dotenv.config();
const app = express();

const MONGO_URI = 'mongodb+srv://kv082321:kv082321@expensebookingai.capxa3k.mongodb.net/CashAdvance?retryWrites=true&w=majority'
// const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors())
// app.use("/travel/internal/api", internalRoutes);
app.use("/nonTravelExpense/api", frontendRoutes);



async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  } catch (error) {
    console.error(`${error} did not connect`);
  }
}

connectToMongoDB();