import Finance from "../models/Finance.js";
import { getWeekRange, getMonthRange, getQuarterRange, getYear } from '../helpers/dateHelpers.js';
import Joi from 'joi';
import { extractCategoryAndTotalAmount } from "./reimbursementController.js";
import REIMBURSEMENT from "../models/reimbursement.js";


export const getTravelAndNonTravelExpenseData = async(tenantId, empId)=>{
    try {
      // const {tenantId} = req.params

      const status = {
        PAID:'paid',
      }

        const expenseReportsToSettle = await Finance.find({
        tenantId,
        or:[{
        'tripSchema.travelExpenseData':{
        $elemMatch:{
        'entriesFlag':false,
        'expenseHeaderStatus':status.PAID}
        }},
        {
        'tenantId':tenantId,
        'entriesFlag':false,
        'expenseHeaderStatus':status.PAID,
        }]
        });

        if (!expenseReportsToSettle) {
          return { success: true, message: `All are settled` };
      } else {

      const travelExpense = expenseReportsToSettle.flatMap((report) =>{
        // console.log("reports expense", report)
        if(!report?.tripSchema || !report?.tripSchema?.travelExpenseData?.length > 1){
          return []
      }
      const {expenseAmountStatus, createdBy} = report.tripSchema

        return report.tripSchema.travelExpenseData
        .filter((expense) => expense.expenseHeaderStatus === status.PENDING_SETTLEMENT)
        .map(({travelRequestId,expenseHeaderId,actionedUpon,settlementBy , expenseHeaderStatus})=>({
          expenseHeaderStatus,
          expenseAmountStatus,
          travelRequestId,
          expenseHeaderId,
          createdBy,
          settlementBy,
          actionedUpon
          }))
      })

      // console.log("travelExpense",travelExpense)
      return travelExpense

    }} catch (error) {
      throw new Error({ error: 'Error in fetching travel expense reports:', error });
    }
};


const nonTravelReportsSchema = Joi.object({
    tenantId: Joi.string().required(),
    empId: Joi.string().required(),
    reportType:Joi.string().required(),
    filterBy: Joi.string().valid('date', 'week', 'month', 'quarter', 'year'),
    date: Joi.date().when('filterBy', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
    startDate: Joi.date(),
    endDate: Joi.date().when('startDate', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
    expenseSubmissionDate: Joi.date(), // validation
}).with('startDate', 'endDate').without('filterBy', [ 'startDate', 'endDate']);

// travel expenses
const tripFilterSchema = Joi.object({
  tenantId: Joi.string().required(),
  empId: Joi.string().required(),
  filterBy: Joi.string().valid('date', 'week', 'month', 'quarter', 'year'),
  date: Joi.date().when('filterBy',{
    is: Joi.exist(),
    then: Joi.required(),
  }),
  startDate: Joi.date(),
  endDate: Joi.date().when('startDate', {
    is: Joi.exist(),
    then: Joi.required(),
  }),
  travelType: Joi.string().valid('domestic', 'international','local').optional(),
  tripStatus: Joi.string().valid('upcoming','modification',
  'transit','completed','paid and cancelled','cancelled','recovered').optional(),
  travelAllocationHeaders: Joi.array().items(Joi.object().keys({
    headerName: Joi.string().required(),
    headerValue: Joi.string().required(),
  })),
  approvers: Joi.array().items(Joi.object().keys({
    name:Joi.string().required(),
    empId:Joi.string().required(),
  }))
});


export async function getAllEntries(req,res) {
try{
  const { error, value } = nonTravelReportsSchema.validate({
    ...req.params,
    ...req.body,
  });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { tenantId, empId, filterBy, date, startDate, endDate, reportType, tripStatus, travelAllocationHeaders, approvers } = value;

  const getReports = [];

  if (reportType === 'travel') {
    console.log("reportType travel", reportType)

    getReports.push(getTravelExpenseReports(value));
  }else if (reportType ==='nonTravel') {
    console.log("reportType nonTravel", reportType)
    getReports.push(getNonTravelExpenseReports(value));
  } else if (reportType ==='cash'){
    console.log("reportType cash", reportType)

    getReports.push(getCashReports(value));
  }  else if (reportType ==='all') {
    console.log("reportType all", reportType)
    getReports.push(getTravelExpenseReports(value),
    getNonTravelExpenseReports(value),
    getCashReports(value));
  } 
  
  const getEntries = await Promise.allSettled(getReports);

  function extractValues(entries) {
    let result = {};
    entries.forEach(entry => {
      const valueObj = entry.value;
      const key = Object.keys(valueObj)[0];
      result[key] = valueObj[key];
    });
    return result;
  }


  const result = extractValues(getEntries);

  getEntries.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Service ${index + 1} succeeded with:`, result.value);
    } else {
      console.error(`Service ${index + 1} failed with reason:`, result.reason);
    }
  });
  
  

  return res.status(200).json({
    ...result,
    success: true,
    message: `Reports retrieved Successfully`,
  });

} catch(error){
  console.log("error in getAllEntries",error.message)
  res.status(500).send({ message: error.message })
}
}

export const getTravelExpenseReports = async (value) => {
try {

  console.log("value", value)
    const { tenantId, empId, filterBy, date, startDate, endDate, travelType, tripStatus, travelAllocationHeaders, approvers } = value;

 console.log("what i got in travel exo", startDate, endDate, )
    const status ={
        PAID:'paid',
        DISTRIBUTED:'paid and distributed'
    }

    let filterCriteria = {    
    tenantId: tenantId,
    'tripSchema.travelExpenseData':{
        $elemMatch:{
            expenseHeaderStatus: status.PAID,
            settlementDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
        }
    }
    };

    if (filterBy && date && (!startDate && !endDate)) {
      if (date) {
        const parsedDate = new Date(date);

        switch (filterBy) {
          case 'date':
            filterCriteria['tripSchema.tripCompletionDate'] = {
                $gte: parsedDate,
                $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
            };
            break;

          case 'week':
            const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
            filterCriteria['tripSchema.tripCompletionDate'] ={
                $gte: startOfWeek,
                $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
              };
            break;

          case 'month':
            const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
            filterCriteria['tripSchema.tripCompletionDate'] = {
                $gte: startOfMonth,
                $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
            };
            break;

          case 'quarter':
            const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
            filterCriteria['tripSchema.tripCompletionDate'] =  {
                $gte: startOfQuarter,
                $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
            };
            break;

          case 'year':
            const { startOfYear, endOfYear } = getYear(parsedDate);
            filterCriteria['tripSchema.tripCompletionDate'] = {
                $gte: startOfYear,
                $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
            };
            break;

          default:
            break;
        }
      }
    } 
    // else if (startDate && endDate) {
    //   filterCriteria['tripSchema.tripCompletionDate'] =  {
    //       $gte: new Date(startDate),
    //       $lte: new Date(endDate),
    //   };
    // }
    //  else if (startDate && endDate) {
    //     filterCriteria['tripSchema.travelExpenseData.submissionDate'] = {
    //       $gte: new Date(startDate),
    //       $lte: new Date(endDate),
    //     };
    // }

    if (travelType) {
      filterCriteria['tripSchema.travelRequestData.travelType'] = travelType;
    }

    if(tripStatus){
      filterCriteria['tripSchema.tripStatus']= tripStatus;
    }

    if(travelAllocationHeaders){
      filterCriteria['tripSchema.travelRequestData.travelAllocationHeaders'] = {
        $elemMatch:{
          headerName:{$in:travelAllocationHeaders.map((header)=> header.headerName)},
          headerValue:{$in:travelAllocationHeaders.map((header)=> header.headerValue),}
        }
      };
    }

    if(approvers){
      filterCriteria['tripSchema.travelRequestData.approvers'] ={
        $elemMatch:{
          name:{$in:approvers.map((approver)=> approver.name)},
          empId:{$in:approvers.map((approver)=> approver.empId)}
          }
          }
    }

    const trips = await Finance.find(filterCriteria);

    if (trips.length === 0) {
      return {travelExpense:[]}
    }

    const travelExpense = trips.flatMap((report) =>{
        console.log("reports expense", JSON.stringify(report.tripSchema.travelExpenseData,null,2))
        if(!report?.tripSchema || !report?.tripSchema?.travelExpenseData?.length > 1){
          return []
      }

      const {travelRequestId, tripName} = report?.tripSchema.travelRequestData
      const {expenseAmountStatus, createdBy, tripStartDate, tripCompletionDate} = report.tripSchema

      const getTravelExpenseData = report.tripSchema.travelExpenseData
        .filter((expense) => expense.expenseHeaderStatus === status.PAID)
        .map(({expenseHeaderId,expenseHeaderNumber,actionedUpon,settlementBy,defaultCurrency, expenseLines, expenseHeaderStatus, SettlementDate , settlementDetails})=>({
          expenseHeaderStatus,
          expenseAmountStatus,
          expenseHeaderId,
          expenseHeaderNumber,
          createdBy,
          settlementBy,
          defaultCurrency,
          SettlementDate,
          actionedUpon,
          expenseLines,
          settlementDetails
          }))

        return{tripName,travelRequestId,expenseAmountStatus,createdBy,tripStartDate, tripCompletionDate, travelExpenseData:getTravelExpenseData}
      })

      console.log("Entries travelExpense",travelExpense)
      return {travelExpense:travelExpense}
} catch (error) {
    console.error(error);
    throw new Error({ error:error.message});
}
};

//to filter Non Travel expense reports based on 'date', 'week', 'month', 'quarter', 'year' and date.
export const getNonTravelExpenseReports = async (value) => {
  try {
    const { tenantId, empId, filterBy, date, startDate, endDate , expenseSubmissionDate } = value;

    const status ={
        PAID: 'paid',
    }

    let filterCriteria = {
      tenantId,
      'expenseHeaderStatus': status.PAID,
    };

    if (filterBy && ( date ) && !startDate && !endDate) {
      if(date){
      const parsedDate = new Date(date);

      switch (filterBy) {
        case 'date':
          filterCriteria['expenseSubmissionDate'] = {
            $gte: parsedDate,
            $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
          };
          break;

        case 'week':
          const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfWeek,
            $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
          };
          break;

        case 'month':
          const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfMonth,
            $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
          };
          break;

        case 'quarter':
          const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfQuarter,
            $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
          };
          break;

        case 'year':
          const { startOfYear, endOfYear } = getYear(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfYear,
            $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
          };
          break;

        default:
          break;
      }
    }
  }  else if (startDate && endDate) {
    filterCriteria['expenseSettledDate'] = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if(expenseSubmissionDate){
    filterCriteria['expenseSubmissionDate']= expenseSubmissionDate;
  }
  const expenseReports = await REIMBURSEMENT.find(filterCriteria);

  if (expenseReports.length === 0) {
    return {nonTravelExpense:[]}
  }

   const nonTravelExpense = expenseReports.map((report) => {
    // console.log("reports expense", JSON.stringify(report, null, 2)); 
  
    const {
      expenseHeaderId,
      expenseHeaderNumber,
      defaultCurrency,
      actionedUpon,
      settlementBy,
      expenseHeaderStatus,
      createdBy,
      expenseLines,
    } = report;
  
    const { expenseAmountStatus } = report;

    const {expenseTotalAmount,results} = extractCategoryAndTotalAmount(expenseLines);
    console.log("expenseTotalAmount",expenseTotalAmount, "results", results)
  
    return {
      expenseHeaderId,
      expenseHeaderNumber,
      defaultCurrency,
      expenseHeaderStatus,
      expenseAmountStatus,
      createdBy,
      settlementBy,
      actionedUpon,
      expenseTotalAmount
    };
  });
  
  console.log("nonTravelExpense", JSON.stringify(nonTravelExpense, null, 2));
  
  return {nonTravelExpense:nonTravelExpense}
} catch (error) {
console.error(error);
throw new Error({
  success: false,
  message: 'Error occurred while retrieving nonTravelReports',
});
}
};

export const oldgetNonTravelExpenseReports = async (value) => {
  try {
    const { tenantId, empId, filterBy, date, startDate, endDate , expenseSubmissionDate } = value;

    const status ={
        PAID: 'paid',
    }

    let filterCriteria = {
      tenantId,
      'reimbursementSchema.expenseHeaderStatus': status.PAID,
    };

    if (filterBy && ( date ) && !startDate && !endDate) {
      if(date){
      const parsedDate = new Date(date);

      switch (filterBy) {
        case 'date':
          filterCriteria['reimbursementSchema.expenseSubmissionDate'] = {
            $gte: parsedDate,
            $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
          };
          break;

        case 'week':
          const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
          filterCriteria['reimbursementSchema.expenseSubmissionDate'] = {
            $gte: startOfWeek,
            $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
          };
          break;

        case 'month':
          const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
          filterCriteria['reimbursementSchema.expenseSubmissionDate'] = {
            $gte: startOfMonth,
            $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
          };
          break;

        case 'quarter':
          const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
          filterCriteria['reimbursementSchema.expenseSubmissionDate'] = {
            $gte: startOfQuarter,
            $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
          };
          break;

        case 'year':
          const { startOfYear, endOfYear } = getYear(parsedDate);
          filterCriteria['reimbursementSchema.expenseSubmissionDate'] = {
            $gte: startOfYear,
            $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
          };
          break;

        default:
          break;
      }
    }
  }  else if (startDate && endDate) {
    filterCriteria['reimbursementSchema.expenseSettledDate'] = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if(expenseSubmissionDate){
    filterCriteria['reimbursementSchema.expenseSubmissionDate']= expenseSubmissionDate;
  }
  const expenseReports = await Finance.find(filterCriteria);

  if (expenseReports.length === 0) {
    return {nonTravelExpense:[]}
  }

   const nonTravelExpense = expenseReports.map((report) => {
    // console.log("reports expense", JSON.stringify(report, null, 2)); 
  
    const {
      expenseHeaderId,
      expenseHeaderNumber,
      defaultCurrency,
      actionedUpon,
      settlementBy,
      expenseHeaderStatus,
      createdBy,
      expenseLines,
    } = report.reimbursementSchema;
  
    const { expenseAmountStatus } = report;

    const {expenseTotalAmount,results} = extractCategoryAndTotalAmount(expenseLines);
    console.log("expenseTotalAmount",expenseTotalAmount, "results", results)
  
    return {
      expenseHeaderId,
      expenseHeaderNumber,
      defaultCurrency,
      expenseHeaderStatus,
      expenseAmountStatus,
      createdBy,
      settlementBy,
      actionedUpon,
      expenseTotalAmount
    };
  });
  
  console.log("nonTravelExpense", JSON.stringify(nonTravelExpense, null, 2));
  
  return {nonTravelExpense:nonTravelExpense}
} catch (error) {
console.error(error);
throw new Error({
  success: false,
  message: 'Error occurred while retrieving nonTravelReports',
});
}
};

export const getCashReports = async(value) => {
  try{
    const { tenantId, empId, filterBy, date, startDate, endDate, travelType, tripStatus, travelAllocationHeaders, approvers } = value;

    console.log("what i got in travel exo", startDate, endDate, )
       const status ={
           PAID:'paid',
       }

       let filterCriteria = {    
       tenantId,
       'cashAdvanceSchema.cashAdvancesData':{
           $elemMatch:{
               cashAdvanceStatus: status.PAID,
              //  submissionDate: {
              //      $gte: new Date(startDate),
              //      $lte: new Date(endDate)
              //  },
           }
       }
       };

       if (filterBy && date && (!startDate && !endDate)) {
         if (date) {
           const parsedDate = new Date(date);
   
           switch (filterBy) {
             case 'date':
               filterCriteria['tripSchema.tripCompletionDate'] = {
                   $gte: parsedDate,
                   $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
               };
               break;
   
             case 'week':
               const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
               filterCriteria['tripSchema.tripCompletionDate'] ={
                   $gte: startOfWeek,
                   $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
                 };
               break;
   
             case 'month':
               const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
               filterCriteria['tripSchema.tripCompletionDate'] = {
                   $gte: startOfMonth,
                   $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
               };
               break;
   
             case 'quarter':
               const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
               filterCriteria['tripSchema.tripCompletionDate'] =  {
                   $gte: startOfQuarter,
                   $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
               };
               break;
   
             case 'year':
               const { startOfYear, endOfYear } = getYear(parsedDate);
               filterCriteria['tripSchema.tripCompletionDate'] = {
                   $gte: startOfYear,
                   $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
               };
               break;
   
             default:
               break;
           }
         } else if (startDate && endDate) {
           filterCriteria['tripSchema.tripCompletionDate'] =  {
               $gte: new Date(startDate),
               $lte: new Date(endDate),
           };
         }
       }
       //  else if (startDate && endDate) {
       //     filterCriteria['tripSchema.travelExpenseData.submissionDate'] = {
       //       $gte: new Date(startDate),
       //       $lte: new Date(endDate),
       //     };
       // }

       if(tripStatus){
         filterCriteria['cashAdvanceSchema.cashAdvanceStatus']= tripStatus;
       }

       if(approvers){
         filterCriteria['tripSchema.travelRequestData.approvers'] ={
           $elemMatch:{
             name:{$in:approvers.map((approver)=> approver.name)},
             empId:{$in:approvers.map((approver)=> approver.empId)}
             }
             }
       }

       const trips = await Finance.find(filterCriteria);
   
       if (trips.length === 0) {
         return []
       }

       const cashData = trips.flatMap((report) =>{
           console.log("reports expense", JSON.stringify(report.cashAdvanceSchema.cashAdvancesData,null,2))
           if(!report?.cashAdvanceSchema || !report?.cashAdvanceSchema?.cashAdvancesData?.length > 1){
             return {cash:[]}
         }

         const {travelRequestId,travelRequestNumber, tripName, createdBy} = report?.cashAdvanceSchema.travelRequestData   
         const getCashAdvanceData = report.cashAdvanceSchema.cashAdvancesData
           .filter((cash) => cash.cashAdvanceStatus === status.PAID)
           .map(({cashAdvanceId,actionedUpon,paidBy, recoveredBy, amountDetails, cashAdvanceStatus,approvers,cashAdvanceNumber,settlementDetails})=>({
             cashAdvanceStatus,
             cashAdvanceId,
             paidBy,
             recoveredBy,
             actionedUpon,
             amountDetails,
             approvers,
             cashAdvanceNumber,
             settlementDetails
             }))

           return{tripName,travelRequestId,travelRequestNumber,createdBy, cashAdvancesData:getCashAdvanceData}
         })
         console.log("Entries cashData",cashData)
         return {cash:cashData}

  }catch(error){
    console.error(error);
  }
}


//status update based on filter criteria
export const updateAllNonTravelExpenseReports = async (req, res) => {
  try {
    const { error, value } = nonTravelReportsSchema.validate({
      ...req.params,
      ...req.body,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { tenantId, empId, filterBy, date, startDate, endDate , expenseSubmissionDate } = value;

    console.log("entries non travel", startDate, endDate ,)
    const status ={
        PAID: 'paid',
        DISTRIBUTED:'paid and distributed'
    }

    let filterCriteria = {
      tenantId,
      'expenseHeaderStatus': status.PAID,
    };

    if (filterBy && ( date ) && !startDate && !endDate) {
      if(date){
      const parsedDate = new Date(date);

      switch (filterBy) {
        case 'date':
          filterCriteria['expenseSubmissionDate'] = {
            $gte: parsedDate,
            $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
          };
          break;

        case 'week':
          const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfWeek,
            $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
          };
          break;

        case 'month':
          const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfMonth,
            $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
          };
          break;

        case 'quarter':
          const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfQuarter,
            $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
          };
          break;

        case 'year':
          const { startOfYear, endOfYear } = getYear(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfYear,
            $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
          };
          break;

        default:
          break;
      }
    }
  }  else if (startDate && endDate) {
    filterCriteria['expenseSubmissionDate'] = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if(expenseSubmissionDate){
    filterCriteria['expenseSubmissionDate']= expenseSubmissionDate;
  }
  const expenseReports = await REIMBURSEMENT.find(filterCriteria);

  if (expenseReports.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'All Non Travel Expense reports are settled for specified date range',
    });
  }

  const updateResult = await REIMBURSEMENT.updateMany(filterCriteria, {
      $set: { 'expenseHeaderStatus': status.DISTRIBUTED }
    });
  
  return res.status(200).json({
    success: true,
    message: `${updateResult.nModified} reports updated successfully`,
  });
} catch (error) {
console.error(error);
return res.status(500).json({
  success: false,
  message: 'Error occurred while retrieving nonTravelReports',
});
}
};

export const updateAllTravelExpenseReports = async (req, res) => {
    try {
      const { error, value } = tripFilterSchema.validate({
        ...req.params, 
        ...req.body
      });
  
      if (error) {
        console.log("what is the error", error)
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const { tenantId, empId, filterBy, date, startDate, endDate, travelType, tripStatus, travelAllocationHeaders, approvers } = value;
  
      const status ={
          PAID:'paid',
          DISTRIBUTED:'paid and distributed'
      }
  
      let filterCriteria = {    
      tenantId: tenantId,
      'tripSchema.travelExpenseData':{
          $elemMatch:{
              expenseHeaderStatus: status.PAID,
              submissionDate: {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate)
              },
          }
      }
      };
  
      if (filterBy && date && (!startDate && !endDate)) {
        if (date) {
          const parsedDate = new Date(date);
  
          switch (filterBy) {
            case 'date':
              filterCriteria['tripSchema.tripCompletionDate'] = {
                  $gte: parsedDate,
                  $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
              };
              break;
  
            case 'week':
              const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
              filterCriteria['tripSchema.tripCompletionDate'] ={
                  $gte: startOfWeek,
                  $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
                };
              break;
  
            case 'month':
              const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
              filterCriteria['tripSchema.tripCompletionDate'] = {
                  $gte: startOfMonth,
                  $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
              };
              break;
  
            case 'quarter':
              const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
              filterCriteria['tripSchema.tripCompletionDate'] =  {
                  $gte: startOfQuarter,
                  $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
              };
              break;
  
            case 'year':
              const { startOfYear, endOfYear } = getYear(parsedDate);
              filterCriteria['tripSchema.tripCompletionDate'] = {
                  $gte: startOfYear,
                  $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
              };
              break;
  
            default:
              break;
          }
        } else if (startDate && endDate) {
          filterCriteria['tripSchema.tripCompletionDate'] =  {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
          };
        }
      } else if (startDate && endDate) {
          filterCriteria['tripSchema.travelExpenseData.expenseSubmissionDate'] = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          };
      }
      
  
      if (travelType) {
        filterCriteria['tripSchema.travelRequestData.travelType'] = travelType;
      }
  
      if(tripStatus){
        filterCriteria['tripSchema.tripStatus']= tripStatus;
      }
  
      if(travelAllocationHeaders){
        filterCriteria['tripSchema.travelRequestData.travelAllocationHeaders'] = {
          $elemMatch:{
            headerName:{$in:travelAllocationHeaders.map((header)=> header.headerName)},
            headerValue:{$in:travelAllocationHeaders.map((header)=> header.headerValue),}
          }
        };
      }
  
      if(approvers){
        filterCriteria['tripSchema.travelRequestData.approvers'] ={
          $elemMatch:{
            name:{$in:approvers.map((approver)=> approver.name)},
            empId:{$in:approvers.map((approver)=> approver.empId)}
            }
            }
      }
  
      const trips = await Finance.find(filterCriteria);
  
      if (trips.length === 0) {
        return res.status(200).json({
          success: false,
          message: 'No trips found matching the filter criteria',
        });
      }
  
      const updateResult = await Finance.updateMany(filterCriteria, {
          $set: { 'tripSchema.travelExpenseData.expenseHeaderStatus': status.DISTRIBUTED }
      });
  
      res.status(200).json(trips);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};




