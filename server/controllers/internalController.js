import mongoose from "mongoose";
import HRCompany from '../model/hr_company_structure.js';
import { expenseCategories } from "../data/expenseCategories.js";
import { reimbursementExpenseCategories } from "../data/reimbursementCategories.js";

const createTenant = async (req, res)=>{
  try{
    
    const {email, companyName, companyHQ, fullName, mobileNumber} = req.body
    if(!email || !companyName || !fullName || !mobileNumber || !companyHQ) return res.status(400).json({message: 'Missing required fields'})

    //other validations
    let companyDetails = {
      companyName: companyName,
      companyLogo: '',
      companyEmail: '',
      companyHeadquarters:companyHQ,
      companySize: '',
      defaultCurrency: '', 
      industry: '',
    }


  //generate unique tenantId
  const tenantId = new mongoose.Types.ObjectId();

  const employee = {
    employeeDetails:{fullName, employeeId:null, designation:null, grade:null,department:null,businessUnit:null,legalEntity:null,costCenter:null,profitCenter:null,responsibilityCenter:null,division:null,project:null,geographicalLocation:null,l1Manager:null,l2Manager:null,l3Manager:null,joiningDate:null,mobileNumber,phoneNumber:null,emailId:email},
    group:['All'],
    travelPreferences: {},
    employeeRoles:{
      employee: true,
      employeeManager: false,
      finance: false,
      businessAdmin: false,
      superAdmin: true,
    },
    temporaryAssignedManager: {
      assignedFor: '',
      approvals: {
        travelRequest: false,
        cashAdvance: false,
        expenseApproval: false,
      }
    },
    onboarder:true,
    delegated: {
      delegatedFor: '',
      endDate: '',
    },
  }

  // Create a new HRCompany document with data from the request body
  const newHRCompany = new HRCompany({
    tenantId: tenantId,
    onboarder: {
      name: fullName,
      emailId: email,
    },
    flags:{
      DIY_FLAG: true,
      GROUPING_FLAG: false,
      ORG_HEADERS_FLAG: false,
      POLICY_SETUP_FLAG: false,
    },
    companyDetails: companyDetails,
    employees: [employee],
    groupHeaders: {
      band: [] ,
      grade: [],
      designation: [],
    },
    orgHeaders: {
      department: [],
      legalEntity: [],
      costCenter: [],
      profitCenter: [],
      businessUnit: [],
      division: [],
      project: [],
      geographicalLocation: [],
      responsibilityCenter: [],
    },

    //other fields that will be set later - multicurrency, expenseCategories, travelAllocation, travelExpenseAllocation, nonTravelExpenseAllocation
    multiCurrency: [],
    expenseCategories: [],
    travelAllocations: [],
    travelExpenseCategories: expenseCategories,
    reimbursementAllocations: [],
    reimbursementExpenseCategories: reimbursementExpenseCategories,
    travelAllocationFlags: {level1:false, level2:false, level3:false},
    groupingLabels:[],
    groups:[],
    policies:{
      travelPolicies:{},
      nonTravelPolicies:{},
    }
  });

  //Save the new HRCompany document to the database
  
    const savedHRCompany = await newHRCompany.save();
    console.log(savedHRCompany, 'newHRCompany')
    res.status(201).json(savedHRCompany); // Respond with the saved HRCompany data
  }
  catch(error){
    res.status(500).json({ error: 'Internal Server Error' })
    console.log(error, 'error') 
  }
}

export  {createTenant};
