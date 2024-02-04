import Finance from "../models/Finance.js";
export const financeController = async(req , res)=>{
    // console.log("LINE AT 6" , req.body.dummyData);
    // res.status(200).send("ok");
    try {
        const completeDummyData = req.body.dummyData;
        // console.log("LINE AT 10" , completeDummyData);
        const {_id , ...others} = {...completeDummyData[0]};
        // console.log("LINE AT 12" , others);

        let finance = new Finance(others);
        const financeDummyData = await finance.save();
        res.status(200).json(financeDummyData)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

