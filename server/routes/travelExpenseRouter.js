const express = require("express");
const router = express.Router();
const travelExpense = require("../models/travelExpense");

router.get("/find" , async(req , res)=>{
    try {
        const singletravelExpenseData = await travelExpense.find();
        res.status(200).json(singletravelExpenseData)
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router;