import reporting, { cashAdvanceStatusEnum, tripStatusEnum } from '../models/reportingSchema.js';
import { getWeekRange, getMonthRange, getQuarterRange, getYear } from '../helpers/dateHelpers.js';
import Joi from 'joi';
import HRCompany from '../models/hrCompanySchema.js';
import { expenseHeaderStatusEnums } from '../models/travelExpenseSchema.js';


function getItinerary(itinerary){
  try {
   const extractItinerary = Object.fromEntries(
      Object.entries(itinerary)
        .filter(([category]) => category !== 'formState')
        .map(([category, items]) => {
          let mappedItems;
          if (category === 'hotels') {
            mappedItems = items.map(({ itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason }) => ({
              category,
              itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason,
            }));
          } else if (category === 'cabs') {
            mappedItems = items.map(({ itineraryId, status, bkd_date, bkd_class, bkd_pickupAddress, bkd_dropAddress }) => ({
              category,
              itineraryId, status, bkd_date, bkd_class, bkd_pickupAddress, bkd_dropAddress,
            }));
          } else {
            mappedItems = items.map(({ itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time, bkd_travelClass, bkd_violations }) => ({
              category,
              itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time, bkd_travelClass, bkd_violations,
            }));
          }

          return [category, mappedItems];
        })
    );
    return extractItinerary;
  } catch (error) {
    
  }
}


const extractTrip = (tripDocs) =>{
  try{
    if(!tripDocs?.length){
      return [];
    }
const getTrips = tripDocs.map(trip => {
  const { travelRequestData, cashAdvancesData, travelExpenseData, expenseAmountStatus, tripId, tripNumber, tripStartDate, tripCompletionDate ,tripStatus} = trip || {};
  const { totalCashAmount, totalRemainingCash } = expenseAmountStatus || {};
  const { travelRequestId, travelRequestNumber, travelRequestStatus, tripPurpose,createdBy,tripName, isCashAdvanceTaken,travelType,approvers, itinerary } = travelRequestData || {};

  const itineraryToSend = getItinerary(itinerary)

  return {
    tripId, tripNumber,
    tripName,
    travelRequestId,
    travelRequestNumber,
    createdBy,
    tripPurpose,
    tripStartDate,
    tripStatus,
    tripCompletionDate,
    travelRequestStatus,
    isCashAdvanceTaken,
    expenseAmountStatus,
    travelType,
    approvers,
    cashAdvances: isCashAdvanceTaken ? (cashAdvancesData ? cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber, amountDetails, cashAdvanceStatus , approvers,cashAdvanceRequestDate,paidBy,recoveredBy,cashAdvanceRejectionReason}) => ({
      cashAdvanceId,
      cashAdvanceNumber,
      amountDetails,
      cashAdvanceStatus,
      approvers,
      cashAdvanceRequestDate,
      paidBy,
      recoveredBy,
      cashAdvanceRejectionReason
    })) : []) : [],
    // travelExpenses: travelExpenseData?.map(({ expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus, approvers ,expenseLines,travelType}) => ({
    //   expenseHeaderId,
    //   expenseHeaderNumber,
    //   expenseHeaderStatus,
    //   approvers, expenseLines,
    // travelType
    // })),
    travelExpenses:travelExpenseData,
    itinerary: itineraryToSend,
  };
});

if(!getTrips){
  return [];
}
return getTrips;
  } catch(error){
    console.log(error);
    throw error
  }
} 

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
  tripStatus: Joi.array().items(Joi.string().valid(...tripStatusEnum)).optional(),
  cashAdvanceStatus: Joi.array().items(Joi.string().valid(...cashAdvanceStatusEnum)).optional(),
  expenseHeaderStatus:Joi.array().items(Joi.string().valid(...expenseHeaderStatusEnums)).optional(),
  travelAllocationHeaders: Joi.array().items(Joi.object().keys({
    headerName: Joi.string().required(),
    headerValue: Joi.string().required(),
  })),
  approvers: Joi.array().items(Joi.object().keys({
    name:Joi.string().required(),
    empId:Joi.string().required(),
  }))
});



const filterTrips = async (req, res) => {
  try {
    const { error, value } = tripFilterSchema.validate({
      ...req.params, 
      ...req.body
    });

    if (error) {
      console.log("what is the error", error)
      return res.status(400).json({ message: error.details[0].message ,  trips:[], success: false
      });
    }

    console.log("filter trips - value", JSON.stringify(value,'',2))
    const { tenantId, empId, filterBy, date, fromDate, toDate, travelType, tripStatus,cashAdvanceStatus, travelAllocationHeaders, approvers } = value;

    let filterCriteria = {    
      tenantId: tenantId,
      'createdBy.empId': empId,
    };

    if (filterBy && date && (!fromDate && !toDate)) {
      if (date) {
        const parsedDate = new Date(date);

        switch (filterBy) {
          case 'date':
            filterCriteria['tripCompletionDate'] = {
                $gte: parsedDate,
                $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
            };
            break;

          case 'week':
            const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
            filterCriteria['tripCompletionDate'] ={
                $gte: startOfWeek,
                $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
              };
            break;

          case 'month':
            const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
            filterCriteria['tripCompletionDate'] = {
                $gte: startOfMonth,
                $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
            };
            break;

          case 'quarter':
            const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
            filterCriteria['tripCompletionDate'] =  {
                $gte: startOfQuarter,
                $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
            };
            break;

          case 'year':
            const { startOfYear, endOfYear } = getYear(parsedDate);
            filterCriteria['tripCompletionDate'] = {
                $gte: startOfYear,
                $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
            };
            break;

          default:
            break;
        }
      }
    }

    if (fromDate && toDate) {
      filterCriteria['tripCompletionDate'] =  {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
      };
    }

    console.log("filter applied", filterCriteria)
    if (travelType) {
      filterCriteria['travelRequestData.travelType'] = travelType;
    }

    if(tripStatus?.length){
      filterCriteria.tripStatus= {$in: tripStatus};
    }
    
    if (cashAdvanceStatus?.length) {
      console.log("i got here", cashAdvanceStatus)
      filterCriteria.cashAdvancesData = {
        $elemMatch:{
          cashAdvanceStatus: { $in: cashAdvanceStatus }
        }
      };
  }
  
    console.log("filterCriteria", JSON.stringify(filterCriteria,'',2))
    if(travelAllocationHeaders){
      filterCriteria['travelRequestData.travelAllocationHeaders'] = {
        $elemMatch:{
          headerName:{$in:travelAllocationHeaders.map((header)=> header.headerName)},
          headerValue:{$in:travelAllocationHeaders.map((header)=> header.headerValue),}
        }
      };
    }

    if(approvers){
      filterCriteria['travelRequestData.approvers'] ={
        $elemMatch:{
          name:{$in:approvers.map((approver)=> approver.name)},
          empId:{$in:approvers.map((approver)=> approver.empId)}
          }
          }
        }
  
        console.log("filterCriteria finally", JSON.stringify(filterCriteria,'',2))
    const tripDocs = await reporting.find(filterCriteria);

    if (tripDocs.length === 0) {
      return res.status(204).json({
        success: true,
        trips:[],
        message: 'No trips found matching the filter criteria',
      });
    }

    const getTrips = extractTrip(tripDocs)
    return res.status(200).json({success:true , trips:getTrips});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const filterCash = async (req, res) => {
  try {
    const { error, value } = tripFilterSchema.validate({
      ...req.params, 
      ...req.body
    });

    if (error) {
      console.log("what is the error", error)
      return res.status(400).json({ message: error.details[0].message ,  trips:[], success: false
      });
    }

    console.log("filter trips - value", JSON.stringify(value,'',2))
    const { tenantId, empId, filterBy, date, fromDate, toDate, travelType, tripStatus,cashAdvanceStatus, travelAllocationHeaders, approvers } = value;

    let filterCriteria = {    
      tenantId: tenantId,
      'createdBy.empId': empId,
    };

    if (filterBy && date && (!fromDate && !toDate)) {
      if (date) {
        const parsedDate = new Date(date);

        switch (filterBy) {
          case 'date':
            filterCriteria['tripCompletionDate'] = {
                $gte: parsedDate,
                $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
            };
            break;

          case 'week':
            const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
            filterCriteria['tripCompletionDate'] ={
                $gte: startOfWeek,
                $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
              };
            break;

          case 'month':
            const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
            filterCriteria['tripCompletionDate'] = {
                $gte: startOfMonth,
                $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
            };
            break;

          case 'quarter':
            const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
            filterCriteria['tripCompletionDate'] =  {
                $gte: startOfQuarter,
                $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
            };
            break;

          case 'year':
            const { startOfYear, endOfYear } = getYear(parsedDate);
            filterCriteria['tripCompletionDate'] = {
                $gte: startOfYear,
                $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
            };
            break;

          default:
            break;
        }
      } else if (fromDate && toDate) {
        filterCriteria['tripCompletionDate'] =  {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
        };
      }
    }

    if (travelType) {
      filterCriteria['travelRequestData.travelType'] = travelType;
    }

    if(tripStatus?.length){
      filterCriteria.tripStatus= {$in: tripStatus};
    }

    if(cashAdvanceStatus?.length){
      filterCriteria.cashAdvancesData.cashAdvanceStatus = {$in: cashAdvanceStatus};
    }

    console.log("filterCriteria", JSON.stringify(filterCriteria,'',2))
    if(travelAllocationHeaders){
      filterCriteria['travelRequestData.travelAllocationHeaders'] = {
        $elemMatch:{
          headerName:{$in:travelAllocationHeaders.map((header)=> header.headerName)},
          headerValue:{$in:travelAllocationHeaders.map((header)=> header.headerValue),}
        }
      };
    }

    if(approvers){
      filterCriteria['travelRequestData.approvers'] ={
        $elemMatch:{
          name:{$in:approvers.map((approver)=> approver.name)},
          empId:{$in:approvers.map((approver)=> approver.empId)}
          }
          }
        }
  
    const tripDocs = await reporting.find(filterCriteria);

    console.log("tripDocs", tripDocs)
    if (tripDocs.length === 0) {
      return res.status(204).json({
        success: true,
        trips:[],
        message: 'No trips found matching the filter criteria',
      });
    }

    const getTrips = extractTrip(tripDocs)
    return res.status(200).json({success:true , trips:getTrips});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const filterTravelExpenses = async (req, res) => {
  try {
    const { error, value } = tripFilterSchema.validate({
      ...req.params, 
      ...req.body
    });

    if (error) {
      console.log("what is the error", error)
      return res.status(204).json({ message: error.details[0].message ,  trips:[], success: true
      });
    }

    console.log("filter trips - value", JSON.stringify(value,'',2))
    const { tenantId, empId, filterBy, date, fromDate, toDate, travelType, tripStatus,expenseHeaderStatus, travelAllocationHeaders, approvers } = value;

    let filterCriteria = {    
      tenantId: tenantId,
      'createdBy.empId': empId,
    };

    if (filterBy && date && (!fromDate && !toDate)) {
      if (date) {
        const parsedDate = new Date(date);

        switch (filterBy) {
          case 'date':
            filterCriteria['tripCompletionDate'] = {
                $gte: parsedDate,
                $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
            };
            break;

          case 'week':
            const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
            filterCriteria['tripCompletionDate'] ={
                $gte: startOfWeek,
                $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
              };
            break;

          case 'month':
            const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
            filterCriteria['tripCompletionDate'] = {
                $gte: startOfMonth,
                $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
            };
            break;

          case 'quarter':
            const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
            filterCriteria['tripCompletionDate'] =  {
                $gte: startOfQuarter,
                $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
            };
            break;

          case 'year':
            const { startOfYear, endOfYear } = getYear(parsedDate);
            filterCriteria['tripCompletionDate'] = {
                $gte: startOfYear,
                $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
            };
            break;

          default:
            break;
        }
      } 
    }

    if (fromDate && toDate) {
      filterCriteria['tripCompletionDate'] =  {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
      };
    }

    if (travelType) {
      filterCriteria['travelRequestData.travelType'] = travelType;
    }

    if(tripStatus?.length){
      filterCriteria.tripStatus= {$in: tripStatus};
    }

    if(expenseHeaderStatus?.length){
      filterCriteria.travelExpenseData={
        $elemMatch:{
          expenseHeaderStatus :{$in: expenseHeaderStatus}
        }
      }
    }

    console.log("filterCriteria", JSON.stringify(filterCriteria,'',2))
    if(travelAllocationHeaders){
      filterCriteria['travelRequestData.travelAllocationHeaders'] = {
        $elemMatch:{
          headerName:{$in:travelAllocationHeaders.map((header)=> header.headerName)},
          headerValue:{$in:travelAllocationHeaders.map((header)=> header.headerValue),}
        }
      };
    }

    if(approvers){
      filterCriteria['travelRequestData.approvers'] ={
        $elemMatch:{
          name:{$in:approvers.map((approver)=> approver.name)},
          empId:{$in:approvers.map((approver)=> approver.empId)}
          }
          }
        }
  
    const tripDocs = await reporting.find(filterCriteria);

    console.log("tripDocs", tripDocs)
    if (tripDocs.length === 0) {
      return res.status(200).json({
        success: false,
        trips:[],
        message: 'No trips found matching the filter criteria',
      });
    }

    const getTrips = extractTrip(tripDocs)
    console.log("trip filter", getTrips?.length, JSON.stringify(getTrips,'',2))
    return res.status(200).json({success:true , trips:getTrips});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getExpenseRelatedHrData = async (req, res) => {
    try {
        const { tenantId, tenantName } = req.params;

        // Find the matching document in HRCompany based on tenantId and tenantName
        const companyDetails = await HRCompany.findOne({ tenantId, tenantName });

        if (!companyDetails) {
            return res.status(404).json({ message: 'Company details not found' });
        }

        // Extract and send the defaultCurrency
        const defaultCurrency = companyDetails.companyDetails.defaultCurrency;

        // Get travelAllocations
        const travelAllocations = companyDetails?.travelAllocations;

        // Get advanceSettlementOptions
        const advanceSettlementOptions = companyDetails?.advanceSettlementOptions;

        // Get expenseSettlementOptions
        const expenseSettlementOptions = companyDetails?.expenseSettlementOptions;

        res.status(200).json({ defaultCurrency, travelAllocations, advanceSettlementOptions, expenseSettlementOptions });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



export {
  extractTrip,
  getItinerary,
  filterTrips,
  filterTravelExpenses
}




