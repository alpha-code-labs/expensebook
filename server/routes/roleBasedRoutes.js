import express from 'express';
import { roleBasedLayout } from '../controllersRoleBased/roleBasedController.js';

export const roleBasedRouter = express.Router()

roleBasedRouter.get('/:tenantId/:empId', roleBasedLayout )


