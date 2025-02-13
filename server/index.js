import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import overview from "./routes/overviewRoutes.js";
import { handleErrors } from "./errorHandler/errorHandler.js";
import { startConsumer } from "./rabbitmq/consumer.js";
import { mainRouter } from "./routes/mainFrontendRoutes.js";
import { consumeFromDashboardQueue } from "./rabbitmq/dashboardConsumer.js";
import { scheduleToFinanceBatchJob } from "./schedulars/finance.js";
import cookieParser from "cookie-parser";
import {
  scheduleToNotificationBatchJob,
} from "./schedulars/notifications.js";
import { closeMongoDBConnection, connectToMongoDB } from "./db/db.js";
import {
  closeRabbitMQConnection,
  getRabbitMQConnection,
} from "./rabbitmq/connection.js";


const environment = process.env.NODE_ENV == "production" ? ".env.prod" : ".env";
dotenv.config({ path: environment });

const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS);
const jwtSecret = process.env.JWT_SECRET;
console.log({ allowedOrigins });
console.log(`Running in ${environment} environment`);
const port = process.env.PORT || 8088;

const app = express();

let server;
let shutdownInProgress = false;

const shutdown = async (reason) => {
  try {
    if (shutdownInProgress) {
      console.log("Shutdown already in progress...");
      return;
    }

    shutdownInProgress = true;
    console.log(`Shutdown initiated: ${reason}`);

    const cleanupTasks = [];

    if (typeof closeRabbitMQConnection === "function") {
      cleanupTasks.push(
        closeRabbitMQConnection()
          .then(() => console.log("RabbitMQ connection closed"))
          .catch((err) => console.error("RabbitMQ cleanup error:", err))
      );
    }

    cleanupTasks.push(
      closeMongoDBConnection()
        .then(() => console.log("MongoDB connection closed"))
        .catch((err) => console.error("MongoDB cleanup error:", err))
    );

    if (server) {
      cleanupTasks.push(
        new Promise((resolve) => {
          server.close(() => {
            console.log("Server connections closed");
            resolve();
          });
        })
      );
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Shutdown timeout")), 10000)
    );

    await Promise.race([Promise.allSettled(cleanupTasks), timeoutPromise]);

    console.log("Cleanup completed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

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
  origin: true,
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

//Routes
app.use("/api/dashboard/overview", overview);
app.use("/api/fe/dashboard", mainRouter);
app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "Dashboard microservice is live" });
});
app.use((req, res, next) => {
  res
    .status(404)
    .json({ success: false, message: "Wrong route. Please check the URL." });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.use((err, req, res, next) => {
  handleErrors(err, req, res, next);
});

//BatchJobs
scheduleToFinanceBatchJob();
// scheduleToNotificationBatchJob()

const initializeServer = async () => {
  try {
    await Promise.all([
      connectToMongoDB(),
      getRabbitMQConnection(),
      consumeFromDashboardQueue(),
      startConsumer("dashboard"),
    ]);

    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
      shutdown("Server error").catch(console.error);
    });
  } catch (error) {
    console.error("Initialization error:", error);
    shutdown("Initialization failure").catch(console.error);
  }
};

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  shutdown("Unhandled Rejection").catch(console.error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  shutdown("Uncaught Exception").catch(console.error);
});

process.on("SIGTERM", () => shutdown("SIGTERM").catch(console.error));
process.on("SIGINT", () => shutdown("SIGINT").catch(console.error));

// Start the server
initializeServer().catch(console.error);
