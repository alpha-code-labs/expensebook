import express from 'express';
import internalDashboardRoute from './dashboardRoutes.js';

// Create a new instance of Express router
const mainInternalRoutes = express.Router();

// Use the internal dashboard route
mainInternalRoutes.use('/trip', internalDashboardRoute);


export default mainInternalRoutes;
