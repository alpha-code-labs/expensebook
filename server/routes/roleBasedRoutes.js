import express from 'express';
import { roleBasedLayout } from '../roleBasedReporting/reportingController.js';

export const roleBasedRouter = express.Router()

roleBasedRouter.get('/:tenantId/:empId', roleBasedLayout )


