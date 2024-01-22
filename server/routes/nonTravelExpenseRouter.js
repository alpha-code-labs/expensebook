const express = require("express");
const { getNonTravelExpenseData, settlementNonTravelExpenseData, unSettlementNonTravelExpenseData } = require("../controller/nonTravelExpenseController");
const router = express.Router();
 
router.get("/find" , getNonTravelExpenseData);
router.put("/settlement" , settlementNonTravelExpenseData);

router.put("/unSettlement" , unSettlementNonTravelExpenseData);
module.exports = router;