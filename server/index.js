import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import frontendRoutes from './routes/frontendRoutes.js'
import internalRoutes from './routes/internalRoutes.js'
import PSFirstTimeIntegrationRoute from './routes/psHRIntegrationRoute.js'
import cors from "cors"


dotenv.config();
const app = express();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors())
app.use("/api", frontendRoutes);
app.use("/api/internal/", internalRoutes)
app.use("/api", PSFirstTimeIntegrationRoute)

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

