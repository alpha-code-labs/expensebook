import express from "express";
import {
    createNewHrCompanyInfo,
    updateExistingHrCompanyInfo,
    handleUpload,
    getTenantHRMaster,
    getTenantEmployees,
    updateTenantEmployeeDetails,
    getTenantEmployee,
    getTenantOrgHeaders,
    updateTenantOrgHeaders,
    getTenantFlags,
    getTenantGroupHeaders,
    createTravelAllocation,
} from "../controllers/frontendController.js";
import { upload } from "../middlewares/upload.js";
const router = express.Router();
router.post("/hrCompanyInfo/existing", updateExistingHrCompanyInfo);
router.post("/hrCompanyInfo/new", createNewHrCompanyInfo);
router.post("/upload-hrInfo", upload.single('file'), handleUpload)
router.get('/tenant/:tenantId/hrCompanyInfo', getTenantHRMaster);
router.get('/tenant/:tenantId/employees', getTenantEmployees);
router.post('/tenant/:tenantId/employeeDetails', updateTenantEmployeeDetails);
router.get('/tenant/:tenantId/employees/:employeeId', getTenantEmployee);
router.get('/tenant/:tenantId/org-headers', getTenantOrgHeaders);
router.post('/tenant/:tenantId/org-headers', updateTenantOrgHeaders);
router.get('/tenant/:tenantId/flags', getTenantFlags);
router.get('/tenant/:tenantId/groupHeaders', getTenantGroupHeaders);

//allocations
//router.get('/tenant/:tenantId/travelAllocations', getTenantTravelAllocations);
router.post('/tenant/:tenantId/create-travel-allocation', createTravelAllocation);


export default router;
