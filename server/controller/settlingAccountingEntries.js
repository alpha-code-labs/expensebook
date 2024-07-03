import Finance from "../models/Finance.js";
import { getWeekRange, getMonthRange, getQuarterRange, getYear } from '../helpers/dateHelpers.js';
import Joi from 'joi';


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
        'reimbursementSchema.tenantId':tenantId,
        'reimbursementSchema.entriesFlag':false,
        'reimbursementSchema.expenseHeaderStatus':status.PAID,
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
    filterBy: Joi.string().valid('date', 'week', 'month', 'quarter', 'year'),
    date: Joi.date().when('filterBy', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
    fromDate: Joi.date(),
    toDate: Joi.date().when('fromDate', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
    expenseSubmissionDate: Joi.date(), // validation
}).with('fromDate', 'toDate').without('filterBy', [ 'fromDate', 'toDate']);


//to filter Non Travel expense reports based on 'date', 'week', 'month', 'quarter', 'year' and date.
export const getNonTravelExpenseReports = async (req, res) => {
  try {
    const { error, value } = nonTravelReportsSchema.validate({
      ...req.params,
      ...req.body,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { tenantId, empId, filterBy, date, fromDate, toDate , expenseSubmissionDate } = value;

    const status ={
        PAID: 'paid',
    }

    let filterCriteria = {
      tenantId,
      'reimbursementSchema.expenseHeaderStatus': status.PAID,
    };

    if (filterBy && ( date ) && !fromDate && !toDate) {
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
  }  else if (fromDate && toDate) {
    filterCriteria['reimbursementSchema.expenseSettledDate'] = {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    };
  }

  if(expenseSubmissionDate){
    filterCriteria['reimbursementSchema.expenseSubmissionDate']= expenseSubmissionDate;
  }
  const expenseReports = await Finance.find(filterCriteria);

  if (expenseReports.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'All Non Travel Expense reports are settled for specified date range',
    });
  }

   const nonTravelExpense = expenseReports.map((report) => {
    // console.log("reports expense", JSON.stringify(report, null, 2)); 
  
    const {
      expenseHeaderId,
      actionedUpon,
      settlementBy,
      expenseHeaderStatus,
      createdBy
    } = report.reimbursementSchema;
  
    const { expenseAmountStatus } = report;
  
    return {
      expenseHeaderId,
      expenseHeaderStatus,
      expenseAmountStatus,
      createdBy,
      settlementBy,
      actionedUpon
    };
  });
  
  console.log("nonTravelExpense", JSON.stringify(nonTravelExpense, null, 2));
  
  return res.status(200).json({
    success: true,
    nonTravelExpense,
    message: `non Travel expense reports retrieved for the specified date range.`,
  });
} catch (error) {
console.error(error);
return res.status(500).json({
  success: false,
  message: 'Error occurred while retrieving nonTravelReports',
});
}
};

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
  
      const { tenantId, empId, filterBy, date, fromDate, toDate , expenseSubmissionDate } = value;
  
      const status ={
          PAID: 'paid',
          DISTRIBUTED:'paid and distributed'
      }
  
      let filterCriteria = {
        tenantId,
        'reimbursementSchema.expenseHeaderStatus': status.PAID,
      };
  
      if (filterBy && ( date ) && !fromDate && !toDate) {
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
    }  else if (fromDate && toDate) {
      filterCriteria['reimbursementSchema.expenseSubmissionDate'] = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }
  
    if(expenseSubmissionDate){
      filterCriteria['reimbursementSchema.expenseSubmissionDate']= expenseSubmissionDate;
    }
    const expenseReports = await Finance.find(filterCriteria);
  
    if (expenseReports.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'All Non Travel Expense reports are settled for specified date range',
      });
    }

    const updateResult = await Finance.updateMany(filterCriteria, {
        $set: { 'reimbursementSchema.expenseHeaderStatus': status.DISTRIBUTED }
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

// travel expenses
const tripFilterSchema = Joi.object({
  tenantId: Joi.string().required(),
  empId: Joi.string().required(),
  filterBy: Joi.string().valid('date', 'week', 'month', 'quarter', 'year'),
  date: Joi.date().when('filterBy',{
    is: Joi.exist(),
    then: Joi.required(),
  }),
  fromDate: Joi.date(),
  toDate: Joi.date().when('fromDate', {
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


export const getTravelExpenseReports = async (req, res) => {
  try {
    const { error, value } = tripFilterSchema.validate({
      ...req.params, 
      ...req.body
    });

    if (error) {
      console.log("what is the error", error)
      return res.status(400).json({ message: error.details[0].message });
    }

    const { tenantId, empId, filterBy, date, fromDate, toDate, travelType, tripStatus, travelAllocationHeaders, approvers } = value;
 console.log("what i got in travel exo", fromDate, toDate, )
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
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            },
        }
    }
    };

    if (filterBy && date && (!fromDate && !toDate)) {
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
      } else if (fromDate && toDate) {
        filterCriteria['tripSchema.tripCompletionDate'] =  {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
        };
      }
    }
    //  else if (fromDate && toDate) {
    //     filterCriteria['tripSchema.travelExpenseData.submissionDate'] = {
    //       $gte: new Date(fromDate),
    //       $lte: new Date(toDate),
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
      return res.status(200).json({
        success: false,
        message: 'No trips found matching the filter criteria',
      });
    }

     
    const travelExpense = trips.flatMap((report) =>{
        console.log("reports expense", JSON.stringify(report.tripSchema.travelExpenseData,null,2))
        if(!report?.tripSchema || !report?.tripSchema?.travelExpenseData?.length > 1){
          return []
      }
      const {expenseAmountStatus, createdBy} = report.tripSchema

        return report.tripSchema.travelExpenseData
        .filter((expense) => expense.expenseHeaderStatus === status.PAID)
        .map(({travelRequestId,expenseHeaderId,actionedUpon,settlementBy, expenseLines, expenseHeaderStatus})=>({
          expenseHeaderStatus,
          expenseAmountStatus,
          travelRequestId,
          expenseHeaderId,
          createdBy,
          settlementBy,
          actionedUpon,
          expenseLines,
          }))
      })

      console.log("Entries travelExpense",travelExpense)
      return res.status(200).json({"message": "Travel Expense Reports extracted successfully",travelExpense});
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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
  
      const { tenantId, empId, filterBy, date, fromDate, toDate, travelType, tripStatus, travelAllocationHeaders, approvers } = value;
  
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
                  $gte: new Date(fromDate),
                  $lte: new Date(toDate)
              },
          }
      }
      };
  
      if (filterBy && date && (!fromDate && !toDate)) {
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
        } else if (fromDate && toDate) {
          filterCriteria['tripSchema.tripCompletionDate'] =  {
              $gte: new Date(fromDate),
              $lte: new Date(toDate),
          };
        }
      } else if (fromDate && toDate) {
          filterCriteria['tripSchema.travelExpenseData.expenseSubmissionDate'] = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
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


