import Joi from "joi";
import Finance from "../models/Finance.js";


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
export const getNonTravelExpenseReport = async (req, res) => {
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
   const nonTravelReports = expenseReports.map((reports)=> reports.reimbursementSchema)
  return res.status(200).json({
    success: true,
    nonTravelReports,
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







