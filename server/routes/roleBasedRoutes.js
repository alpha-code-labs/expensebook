import express from 'express';
import { getAllManagerReports, roleBasedLayout } from '../roleBasedReporting/reportingController.js';

export const roleBasedRouter = express.Router()

roleBasedRouter.get('/:tenantId/:empId/employee', roleBasedLayout )

roleBasedRouter.get('/:tenantId/:empId/admin', getAllManagerReports)
