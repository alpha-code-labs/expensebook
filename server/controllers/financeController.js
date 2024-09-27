import Joi from "joi";
import { cashAdvanceStatusEnum, tripStatusEnum } from "../models/reportingSchema.js";
import { expenseHeaderStatusEnums } from "../models/travelExpenseSchema.js";

const tripFilterSchema = Joi.object({
  tenantId: Joi.string().required(),
  empId: Joi.string().required(),
  role : Joi.string().valid('myView','financeView','teamView').required(),
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
  empNames: Joi.array().items(Joi.object()).optional(),
  tripStatus: Joi.array().items(Joi.string().valid(...tripStatusEnum)).optional(),
  cashAdvanceStatus: Joi.array().items(Joi.string().valid(...cashAdvanceStatusEnum)).optional(),
  expenseHeaderStatus:Joi.array().items(Joi.string().valid(...expenseHeaderStatusEnums)).optional(),
  getGroups:Joi.array().items(Joi.string()).optional(),
  travelAllocationHeaders: Joi.array().items(Joi.object().keys({
    headerName: Joi.string().required(),
    headerValue: Joi.string().required(),
  })),
  approvers: Joi.array().items(Joi.object().keys({
    name:Joi.string().required(),
    empId:Joi.string().required(),
  }))
});


const financeSchema = Joi.object({
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
    empNames:Joi.array().items(Joi.object()).optional(),
    expenseHeaderStatus: Joi.array().items(Joi.string().valid(...expenseHeaderStatusEnums)).optional(),
    expenseSubmissionDate: Joi.date(), // validation
  }).with('fromDate', 'toDate').without('filterBy', [ 'fromDate', 'toDate']);


const dataSchema = Joi.object({
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
    empNames:Joi.array().items(Joi.object()).optional(),
    expenseHeaderStatus: Joi.array().items(Joi.string().valid(...expenseHeaderStatusEnums)).optional(),
    expenseSubmissionDate: Joi.date(), // validation
    getGroups:Joi.array().items(Joi.string()).optional(),
  }).with('fromDate', 'toDate').without('filterBy', [ 'fromDate', 'toDate']);


export {
    dataSchema,
    tripFilterSchema,
  }