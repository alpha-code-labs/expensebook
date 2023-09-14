import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import internalRoutes from './routes/internalRoutes.js'
import frontendRouts from './routes/frontendRoutes.js'

dotenv.config();
const app = express();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use("travel/internal/api/", internalRoutes);
app.use("travel/api/", frontendRouts);


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
