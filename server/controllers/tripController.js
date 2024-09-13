import reporting from '../models/reportingSchema.js';
import { getWeekRange, getMonthRange, getQuarterRange, getYear } from '../helpers/dateHelpers.js';
import Joi from 'joi';
import HRCompany from '../models/hrCompanySchema.js';

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


export const filterTrips = async (req, res) => {
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

    let filterCriteria = {    
      tenantId: tenantId,
      'tripSchema.createdBy.empId': empId,
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
  
    const trips = await reporting.find(filterCriteria);

    if (trips.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No trips found matching the filter criteria',
      });
    }

    res.status(200).json(trips);
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









