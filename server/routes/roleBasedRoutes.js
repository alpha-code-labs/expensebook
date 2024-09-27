import express from 'express';
import { getAllFinanceReports, getAllManagerReports, roleBasedLayout } from '../roleBasedReporting/reportingController.js';

export const roleBasedRouter = express.Router()

roleBasedRouter.get('/:tenantId/:empId/employee', roleBasedLayout )

roleBasedRouter.get('/:tenantId/:empId/admin', getAllManagerReports)

roleBasedRouter.get('/:tenantId/:empId/finance', getAllFinanceReports)


