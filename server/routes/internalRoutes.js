import express from "express";
import {createTenant} from '../controllers/internalController.js'

const router = express.Router();
router.post('/create-tenant', createTenant)

export default router