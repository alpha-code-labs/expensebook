const express = require("express");
const router = express.Router();
const CashAdvance = require("../models/cashAdvance");

router.get("/find/:id" , async(req , res)=>{
    try {
        const singleCashAdvanceData = await CashAdvance.findById(req.param.id);
        res.status(200).json(singleCashAdvanceData)
    } catch (error) {
        res.status(500).json(error);
    }
});

// const dummyCashAdvanceData = require("../dummyData/DummyData");
// // console.log(dummyCashAdvanceData.cashAdvancesData);

module.exports = router;



