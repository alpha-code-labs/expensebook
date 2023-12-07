import express  from "express";
import { getTravelRequestDetails, getTravelRequestsAndCashAdvancesForApprover, getTravelRequestsStandalone, 
    getTravelWithCashDetails, travelStandaloneApprove, travelStandaloneReject, travelWithCashApproveCashAdvance, 
    travelWithCashApproveTravelRequest, travelWithCashRejectCashAdvance, travelWithCashRejectTravelRequest,  
} from "../controllers/travelApproval.js";

const travel = express.Router();

//------Approval Flow for Travel Requests without cash advance --- 

//1) standalone tr -- row 5 --
travel.get("/tr-list/:tenantId/:empId", getTravelRequestsStandalone); // working

//2) standalone TRAVEL REQUEST DETAILS for an approver -- row 5--
travel.get('/tr-details/:tenantId/:travelRequestId/:empId', getTravelRequestDetails);// working

//3) standalone tr--approve -- row 8
travel.patch("/tr-approve/:tenantId/:travelRequestId/:empId", travelStandaloneApprove); // working

//4) standalone tr--approve -- row 16
travel.patch("/tr-reject/:tenantId/:travelRequestId/:empId", travelStandaloneReject); // working

//-------Approval Flow for Travel Requests with cash advance - Raised Together-----

//5) TRAVEL REQUEST WITH CASH ADVANCE -- ROW 23
travel.get("/tr-ca-list/:tenantId/:empId", getTravelRequestsAndCashAdvancesForApprover); //working

//6) TRAVEL REQUEST WITH CASH ADVANCE DETAILS  -- row 24--
travel.get('/tr-ca-details/:tenantId/:travelRequestId/:empId', getTravelWithCashDetails); // working

// 7) travel with cash advance -- Approve Travel Request
travel.patch('/tr-ca-approve-tr/:tenantId/:travelRequestId/:empId', travelWithCashApproveTravelRequest); // working

// 8) travel with cash advance -- Reject Travel Request
// (IF Travel request is rejected then status of cash advance is updated to draft)
travel.patch('/tr-ca-reject-tr/:tenantId/:travelRequestId/:empId', travelWithCashRejectTravelRequest); // working

// 9) travel with cash advance -- Approve cash advance 
travel.patch('/tr-ca-approve-ca/:tenantId/:travelRequestId/:empId', travelWithCashApproveCashAdvance); //Working..

// 10) travel with cash advance -- Reject cash advance 
travel.patch('/tr-ca-reject-ca/:tenantId/:travelRequestId/:empId', travelWithCashRejectCashAdvance); // working


// To Other MICROSERVICES

// TRAVEL REQUEST WITH CASH ADVANCE --approved  -- row 27-- (APPROVED - CASH BACKEND)
// TRAVEL REQUEST WITH CASH ADVANCE --rejected -- row 27--


export default travel






