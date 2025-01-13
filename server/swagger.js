import swaggerAutogen from "swagger-autogen";


const doc = {
  info: {
    title: "Trip-server",
    description: "ExpenseBook Trip-server Microservice",
  },
  host: "localhost:8006",
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/tripRoutes.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
  root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
