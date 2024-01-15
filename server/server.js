const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors");

const cashAdvanceRouter = require("./routes/cashAdvanceRouter");
const travelExpenseRouter = require("./routes/travelExpenseRouter");
const nonTravelExpenseRouter = require("./routes/nonTravelExpenseRouter");

const app = express();


const Product=require('./models/cashAdvance');


const Cash = require("./models/cashAdvance");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//finding cash advances with actionedUpon flag as No
app.get("/cashadvance", async (req, res) => {
  try {
    const cashadvances = await Cash.find({ actionedUpon: "No" });

    // Extracting empId and name from each approver and storing in separate variables
    /*const cashAdvancesWithApprovers = cashadvances.map((cashadvance) => {
      const empIds = cashadvance.approvers.map((approver) => approver.empId);
      const names = cashadvance.approvers.map((approver) => approver.name);

      return {
        ...cashadvance._doc,
        empIds: empIds,
        names: names,
      };
    });*/
    /*
      const Finance = require('./models/Finance');
      // Insert the data into the 'finance' collection
      const result = await Finance.insertMany(cashadvances);*/
    //const financeData = await Finance.find({});
    res.status(200).json({
        cashadvances
      //cashAdvances: cashAdvancesWithApprovers,
      //financeData: financeData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//modify status when marked as settled
// app.put("/cashadvance", async (req, res) => {
//   try {
//     const cashadvance = await Cash.findOneAndUpdate(
//       /*id,*/
//         { $set: { settlementFlag: true } }, // Update only the cashAdvanceStatus field
//         { new: true } // To return the updated document
//       // id,
//       // req.body
//     );

//     if (!cashadvance) {
//       return res.status(404).json({ message: `Element not found` });
//     }
//     const updatedcashadvance = await Cash.findById(id);
//     res.status(200).json(updatedcashadvance);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message });
//   }
// });












// 09/01/24
app.use(cors());
app.use("/api/cashAdvance" , cashAdvanceRouter);
app.use("/api/travelExpense" , travelExpenseRouter);
app.use("/api/nonTravelExpense" , nonTravelExpenseRouter);

mongoose.connect("mongodb+srv://acladmin:QlSYiddbBy7J9yS6@mycluster.58esz73.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("Connected to mongodb")
    app.listen (3000,()=>{
        console.log(`Node API app is running on port 3000`)
    })
}).catch((error)=>{
    console.log(error)
})

