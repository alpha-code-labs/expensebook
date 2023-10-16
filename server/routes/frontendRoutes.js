import express from 'express';
import CashAdvance from '../models/cashSchema.js';
import {createCashAdvance, getCashAdvances, getTravelRequest} from '../controllers/cashAdvanceController.js';
import travelRequestsJsonData from '../dummyData/dummyData.js'; // Import your dummy data
import createCashAdvanceId from '../utils/createCashAdvanceId.js';

const router = express.Router();

//post cash advance along with corresponding travel request route

router.post('/create-cash-advance/:travelRequestId',createCashAdvance);
router.get('/get-travel-request/:travelRequestId',getTravelRequest);

// Get cash advance along with embedded travel request details
router.get('/get-cash-advance', getCashAdvances);



router.get('/get-cash-advance/:cashAdvanceId', async (req, res) => {
  try {
    const { cashAdvanceId } = req.params;
    if (!cashAdvanceId) {
      return res
        .status(400)
        .json({ message: "missing travel request identifier" });
    }
    const cashAdvanceRequest = await CashAdvance.findOne(
      { cashAdvanceId },
      // { travelAndNonTravelPolicies: 0 }
    );

    if (!cashAdvanceRequest) {
      return res.status(404).json({ message: "not found" });
    }

    return res.status(200).json(cashAdvanceRequest);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//update cash advance details route

router.put('/update-cash-advance/:cashAdvanceId', async (req, res) => {
  try {
    const { cashAdvanceId } = req.params;

    const cashAdvanceRequest = await CashAdvance.findOne({ cashAdvanceId });

    if (!cashAdvanceRequest) {
      return res.status(404).json({ message: "Cash Advance request not found" });
    }

    const updatedData = req.body;

    Object.assign(cashAdvanceRequest, updatedData);

    await cashAdvanceRequest.save();

    return res.status(200).json({ message: "Cash Advance request updated successfully", data: cashAdvanceRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while updating the Cash Advance request' });
  }
});

//update cash advance status route

router.patch('/cash-requests/:cashAdvanceId/status', async (req, res) => {
  try {
    const { cashAdvanceId } = req.params;
    let { cashAdvanceStatus } = req.body;

    cashAdvanceStatus = cashAdvanceStatus.toLowerCase();
    const status = [
      'draft',
      'pending approval' ,
      'approved' ,       
      'rejected' ,
      'awaiting pending settlement' , 
      'pending settlement' ,
      'paid',
      'cancelled'
    ];

    if (!status.includes(cashAdvanceStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    //condition status check
    const existingCashAdvance = await CashAdvance.findOne({cashAdvanceId});

    if(!existingCashAdvance){
      return res.status(404).json({message: "Record not found"})
    }  

    if(existingCashAdvance.cashAdvanceStatus === "paid" && cashAdvanceStatus==="cancelled"){
      return res.status(400).json({message:"Cannot change status cancelled for Paid CashAdvance"})
    }



    const result = await CashAdvance.findOneAndUpdate(
      { cashAdvanceId },
      { cashAdvanceStatus },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({
      message: `Status updated to ${cashAdvanceStatus}`,
      updatedCashAdvance: result,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});




export default router;