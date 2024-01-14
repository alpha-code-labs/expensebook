const express = require("express");
const router = express.Router();
const nonTravelExpense = require("../models/nonTravelExpense");

router.get("/find" , async(req , res)=>{
    try {
        const singleNonTravelExpenseData = await nonTravelExpense.find();
        res.status(200).json(singleNonTravelExpenseData)
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router;