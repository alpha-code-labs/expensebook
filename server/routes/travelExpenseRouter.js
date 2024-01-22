const express = require("express");
const router = express.Router();
const { getTravelExpenseData, settlementTravelExpenseData, unSettlementTravelExpenseData } = require("../controller/travelExpenseController");

router.get("/find" , getTravelExpenseData);

router.put("/settlement" , settlementTravelExpenseData);

router.put("/unSettlement" , unSettlementTravelExpenseData);

module.exports = router;