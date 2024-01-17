const express = require("express");
const Finance = require("../models/Finance");
const router = express.Router();

router.get("/post" , async(req , res)=>{
    // console.log(req.body.dummyValues);
    // res.status(200).send("ok");
    try {
        const completeDummyData = req.body.dummyValues;
        console.log(completeDummyData);
        let finance = new Finance({...completeDummyData});
        const financeDummyData = await finance.save();
        res.status(200).json(financeDummyData)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router;