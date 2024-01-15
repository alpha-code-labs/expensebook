const express = require("express");
const router = express.Router();
const CashAdvance = require("../models/cashAdvance");

router.get("/find" , async(req , res)=>{
    try {
        const singleCashAdvanceData = await CashAdvance.find();
        res.status(200).json(singleCashAdvanceData);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put("/settlement" , async(req , res)=>{
    // console.log("LINE AT 15" , req.body);
    const id = req.body._id;
    // console.log("LINE AT 15" , id);

    try {
    const singleCashAdvanceUpdate = await CashAdvance.findByIdAndUpdate(
        id,
           {$set: {settlementFlag: true}} , // Update only the cashAdvanceStatus field
           { new: true } 
      );
  
      if (!singleCashAdvanceUpdate) {
        return res.status(404).json({ message: `Element not found` });
      }
      res.status(200).json(singleCashAdvanceUpdate);
    } catch (error) {
      console.log("LINE AT 30" , error.message);
      res.status(500).json(error);
    }
});

router.put("/unSettlement" , async(req , res)=>{
    console.log("LINE AT 37" , req.body);
    const id = req.body._id;
    console.log("LINE AT 39" , id);

    try {
    const singleCashAdvanceUpdateAgain = await CashAdvance.findByIdAndUpdate(
        id,
           {$set: {settlementFlag: false}} , // Update only the cashAdvanceStatus field
           { new: true } 
      );
  
      if (!singleCashAdvanceUpdateAgain) {
        return res.status(404).json({ message: `Element not found` });
      }
      res.status(200).json(singleCashAdvanceUpdateAgain);
    } catch (error) {
      console.log("LINE AT 53" , error.message);
      res.status(500).json(error);
    }
});


module.exports = router;



