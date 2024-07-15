import express  from "express";
import {  approveAddALeg, approveAllTravelWithCash, approveTravelWithCash, getTravelRequestDetails, getTravelRequestDetailsForApprover, getTravelRequestsAndCashAdvancesForApprover, 
    getTravelWithCashDetails, getTravelWithCashDetailsForAddALeg, rejectAddALeg, rejectTravelWithCash, travelStandaloneApprove, travelStandaloneReject, travelWithCashApproveCashAdvance, 
    travelWithCashApproveTravelRequest, travelWithCashRejectCashAdvance, travelWithCashRejectTravelRequest,  
} from "../controllers/travelApproval.js";

const travel = express.Router();

//------Approval Flow for Travel Requests without cash advance ---
travel.get('/test', (req,res) => { return res.status(200).json({"success":true, "message":"Approval Docker image is running successfully"})})


// 1) standalone TRAVEL REQUEST DETAILS for an approver -- row 5--
travel.get('/tr-details/:tenantId/:empId/:travelRequestId', getTravelRequestDetails);// working -- ok

//2) standalone tr--approve -- row 8
travel.patch("/approve-tr-standalone/:tenantId/:empId/:travelRequestId", travelStandaloneApprove); // working -- ok

//3) standalone tr--approve -- row 16
travel.patch("/reject-tr-standalone/:tenantId/:empId/:travelRequestId", travelStandaloneReject); // working -- ok 

// 4) approve both tr and cash
travel.patch('/approve/:tenantId/:empId/:travelRequestId', approveTravelWithCash)

//5) approve array of travelRequests
travel.patch('/approve/:tenantId/:empId', approveAllTravelWithCash)

//6) reject travel with/without cash
travel.patch('/reject/:tenantId/:empId/:travelRequestId', rejectTravelWithCash)


// 7) travel with cash advance -- Approve cash advance 
travel.patch('/approve-ca/:tenantId/:empId/:travelRequestId/:cashAdvanceId', travelWithCashApproveCashAdvance); //Working -- ok

// 8) travel with cash advance -- Reject cash advance 
travel.patch('/reject-ca/:tenantId/:empId/:travelRequestId/:cashAdvanceId', travelWithCashRejectCashAdvance); // working -- ok







//-------Approval Flow for Travel Requests with cash advance - Raised Together-----

//5) TRAVEL REQUEST WITH CASH ADVANCE -- ROW 23
travel.get("/tr-ca-list/:tenantId/:empId", getTravelRequestsAndCashAdvancesForApprover); //working

//6) TRAVEL REQUEST WITH CASH ADVANCE DETAILS  -- row 24--
travel.get('/tr-ca-details/:tenantId/:empId/:travelRequestId', getTravelWithCashDetails); // working

// 7) travel with cash advance -- Approve Travel Request
travel.patch('/approve-tr/:tenantId/:empId/:travelRequestId', travelWithCashApproveTravelRequest); // working

// 8) travel with cash advance -- Reject Travel Request
// (IF Travel request is rejected then status of cash advance is updated to draft)
travel.patch('/reject-tr/:tenantId/:empId/:travelRequestId', travelWithCashRejectTravelRequest); // working


// 12) Add a leg - get travel request details 
travel.get('/leg/details/:tenantId/:travelRequestId/:empId', getTravelWithCashDetailsForAddALeg); // working

// 13  -- Approve add a leg
travel.patch('/leg/approve/:tenantId/:empId/:travelRequestId/:itineraryId', approveAddALeg); // working

// 14)  -- Reject add a leg 
travel.patch('/leg/reject/:tenantId/:empId/:travelRequestId/:itineraryId', rejectAddALeg); // working

// 15) -- get all travel Request Details
travel.get('/getTravelRequest/:tenantId/:empId/:travelRequestId', getTravelRequestDetailsForApprover);


export default travel






// import express  from "express";
// import {  approveAddALeg, getTravelRequestDetails, getTravelRequestDetailsForApprover, getTravelRequestsAndCashAdvancesForApprover, getTravelRequestsStandalone, 
//     getTravelWithCashDetails, getTravelWithCashDetailsForAddALeg, rejectAddALeg, travelStandaloneApprove, travelStandaloneReject, travelWithCashApproveCashAdvance, 
//     travelWithCashApproveTravelRequest, travelWithCashRejectCashAdvance, travelWithCashRejectTravelRequest,  
// } from "../controllers/travelApproval.js";

// const travel = express.Router();

// //------Approval Flow for Travel Requests without cash advance ---
// travel.get('/test', (req,res) => { return res.status(200).json({"success":true, "message":"Approval Docker image is running successfully"})})


// // 1) standalone TRAVEL REQUEST DETAILS for an approver -- row 5--
// travel.get('/tr-details/:tenantId/:empId/:travelRequestId', getTravelRequestDetails);// working -- ok

// //2) standalone tr--approve -- row 8
// travel.patch("/approve-tr-standalone/:tenantId/:empId/:travelRequestId", travelStandaloneApprove); // working -- ok

// //3) standalone tr--approve -- row 16
// travel.patch("/reject-tr-standalone/:tenantId/:empId/:travelRequestId", travelStandaloneReject); // working -- ok 





// //-------Approval Flow for Travel Requests with cash advance - Raised Together-----

// //5) TRAVEL REQUEST WITH CASH ADVANCE -- ROW 23
// travel.get("/tr-ca-list/:tenantId/:empId", getTravelRequestsAndCashAdvancesForApprover); //working

// //6) TRAVEL REQUEST WITH CASH ADVANCE DETAILS  -- row 24--
// travel.get('/tr-ca-details/:tenantId/:empId/:travelRequestId', getTravelWithCashDetails); // working

// // 7) travel with cash advance -- Approve Travel Request
// travel.patch('/approve-tr/:tenantId/:empId/:travelRequestId', travelWithCashApproveTravelRequest); // working

// // 8) travel with cash advance -- Reject Travel Request
// // (IF Travel request is rejected then status of cash advance is updated to draft)
// travel.patch('/reject-tr/:tenantId/:empId/:travelRequestId', travelWithCashRejectTravelRequest); // working

// // 9) travel with cash advance -- Approve cash advance 
// travel.patch('/approve-ca/:tenantId/:empId/:travelRequestId/:cashAdvanceId', travelWithCashApproveCashAdvance); //Working -- ok

// // 10) travel with cash advance -- Reject cash advance 
// travel.patch('/reject-ca/:tenantId/:empId/:travelRequestId/:cashAdvanceId', travelWithCashRejectCashAdvance); // working -- ok


// // 12) Add a leg - get travel request details 
// travel.get('/leg/details/:tenantId/:travelRequestId/:empId', getTravelWithCashDetailsForAddALeg); // working


// // 13  -- Approve add a leg
// travel.patch('/leg/approve/:tenantId/:empId/:travelRequestId/:itineraryId', approveAddALeg); // working

// // 14)  -- Reject add a leg 
// travel.patch('/leg/reject/:tenantId/:empId/:travelRequestId/:itineraryId', rejectAddALeg); // working

// // 15) -- get all travel Request Details
// travel.get('/getTravelRequest/:tenantId/:empId/:travelRequestId', getTravelRequestDetailsForApprover);

// //1) standalone tr -- row 5 --
// travel.get("/tr-list/:tenantId/:empId", getTravelRequestsStandalone); // working


// export default travel









