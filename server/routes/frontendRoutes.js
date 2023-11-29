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
    updateTravelAllocation,
    updateTravelExpenseAllocation,
    updateNonTravelExpenseAllocation,
    getTenantTravelAllocation,
    getTenantTravelExpenseAllocation,
    getTenantNonTravelExpenseAllocation,
    updateTenantGroupingLabels,
    getTenantGroupingLabels,
    updateTenantGroups,
    getTenantGroups,
    updateTenantPolicies,
    getTenantPolicies,
    getTenantExpenseCategories,
    getTenantAccountLines,
    updateTenantAccountLines,
    updateTenantMulticurrencyTable,
    getTenantMultiCurrencyTable,
    getTenantCashAdvanceOptions,
    getTenantCashExpenseOptions,
    updateTenantCashAdvanceOptions,
    updateTenantCashExpenseOptions,
    getTenantSystemRelatedRoles,
    updateTenantSystemRelatedRoles,
    updateBlanketDelegations,
    getBlanketDelegations,
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
router.get('/tenant/:tenantId/group-headers', getTenantGroupHeaders);

//allocations
//router.get('/tenant/:tenantId/travelAllocations', getTenantTravelAllocations);
router.post('/tenant/:tenantId/travel-allocation', updateTravelAllocation);
router.post('/tenant/:tenantId/travel-expense-allocation', updateTravelExpenseAllocation);
router.post('/tenant/:tenantId/non-travel-expense-allocation', updateNonTravelExpenseAllocation);
//get routes
router.get('/tenant/:tenantId/travel-allocation', getTenantTravelAllocation);
router.get('/tenant/:tenantId/travel-expense-allocation', getTenantTravelExpenseAllocation);
router.get('/tenant/:tenantId/non-travel-expense-allocation', getTenantNonTravelExpenseAllocation);

//groups
router.post('/tenant/:tenantId/grouping-labels', updateTenantGroupingLabels)
router.get('/tenant/:tenantId/grouping-labels', getTenantGroupingLabels)
router.post('/tenant/:tenantId/groups', updateTenantGroups)
router.get('/tenant/:tenantId/groups', getTenantGroups)

//policies
router.get('/tenant/:tenantId/policies', getTenantPolicies)
router.post('/tenant/:tenantId/policies', updateTenantPolicies)

//expense categories
router.get('/tenant/:tenantId/expense-categories', getTenantExpenseCategories)


//account lines
router.get('/tenant/:tenantId/account-lines', getTenantAccountLines)
router.post('/tenant/:tenantId/account-lines', updateTenantAccountLines)

//multicurrency
router.post('/tenant/:tenantId/multicurrency', updateTenantMulticurrencyTable)
router.get('/tenant/:tenantId/multicurrency', getTenantMultiCurrencyTable)

//expense options
router.post('/tenant/:tenantId/expense-settlement-options', updateTenantCashExpenseOptions)
router.post('/tenant/:tenantId/advance-settlement-options', updateTenantCashAdvanceOptions)

router.get('/tenant/:tenantId/expense-settlement-options', getTenantCashExpenseOptions)
router.get('/tenant/:tenantId/advance-settlement-options', getTenantCashAdvanceOptions)


//system related roles
router.post('/tenant/:tenantId/system-related-roles', updateTenantSystemRelatedRoles)
router.get('/tenant/:tenantId/system-related-roles', getTenantSystemRelatedRoles)

//blanket delegations
router.post('/tenant/:tenantId/blanket-delegations', updateBlanketDelegations)
router.get('/tenant/:tenantId/blanket-delegations', getBlanketDelegations)

export default router;
