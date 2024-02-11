import express  from "express";
import {  approveAddALeg, getTravelRequestDetails, getTravelRequestDetailsForApprover, getTravelRequestsAndCashAdvancesForApprover, getTravelRequestsStandalone, 
    getTravelWithCashDetails, getTravelWithCashDetailsForAddALeg, rejectAddALeg, travelStandaloneApprove, travelStandaloneReject, travelWithCashApproveCashAdvance, 
    travelWithCashApproveTravelRequest, travelWithCashRejectCashAdvance, travelWithCashRejectTravelRequest,  
} from "../controllers/travelApproval.js";

const travel = express.Router();

//------Approval Flow for Travel Requests without cash advance ---

//1) standalone tr -- row 5 --
travel.get("/tr-list/:tenantId/:empId", getTravelRequestsStandalone); // working

//2) standalone TRAVEL REQUEST DETAILS for an approver -- row 5--
travel.get('/tr-details/:tenantId/:empId/:travelRequestId', getTravelRequestDetails);// working

//3) standalone tr--approve -- row 8
travel.patch("/tr-approve/:tenantId/:empId/:travelRequestId", travelStandaloneApprove); // working

//4) standalone tr--approve -- row 16
travel.patch("/tr-reject/:tenantId/:empId/:travelRequestId", travelStandaloneReject); // working

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


// 12) Add a leg - get travel request details 
travel.get('/leg/details/:tenantId/:travelRequestId/:empId', getTravelWithCashDetailsForAddALeg); // working


// 13  -- Approve add a leg
travel.patch('/leg/approve/:tenantId/:travelRequestId/:empId/:itineraryId', approveAddALeg); // working

// 14)  -- Reject add a leg 
travel.patch('/leg/reject/:tenantId/:travelRequestId/:empId/:itineraryId', rejectAddALeg); // working

// 15) -- get all travel Request Details
travel.get('/getTravelRequest/:tenantId/:empId/:travelRequestId', getTravelRequestDetailsForApprover);

// To Other MICROSERVICES
// TRAVEL REQUEST WITH CASH ADVANCE --approved  -- row 27-- (APPROVED - CASH BACKEND)
// TRAVEL REQUEST WITH CASH ADVANCE --rejected -- row 27--

export default travel






