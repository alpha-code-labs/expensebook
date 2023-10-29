import express  from "express";
import { NonTravelExpenseStatusApproved, NonTravelExpenseStatusRejected, getExpensesByApproverId, getExpensesByEmployeeName, getExpensesByExpenseStatus, viewNonTravelExpenseList } from "../controllers/nonTravelExpenseApproval.js";


const router = express.Router();

router.get('/nonTravel/:empId', getExpensesByApproverId);

//Search non travel expenses by employeeName
router.get('/nonTravel/:empId/search/:employeeName', getExpensesByEmployeeName);

//approver can filter by expenseStatus
router.get('/nonTravel/:expenseStatus/:empId',getExpensesByExpenseStatus);

//List of expenses uploaded by 1 person under 1 expenseHeader
router.get('/nonTravel/list/:expenseHeaderID/:empId', viewNonTravelExpenseList); 

//For a single bill, Status change to approved
router.put('/nonTravel/billStatusApproved/:expenseHeaderID/:empId', NonTravelExpenseStatusApproved);

//For a single bill, Status change to rejected
router.put('/nonTravel/BillStatusRejected/:expenseHeaderID/:empId', NonTravelExpenseStatusRejected);


export default router






