const express = require("express");
const router = express.Router();
 
const { getCashAdvanceData, settlement, unSettlement } = require("../controller/cashAdvanceController");

router.get("/find" , getCashAdvanceData);

router.put("/settlement" , settlement);

router.put("/unSettlement" , unSettlement);


module.exports = router;



