import express from 'express'
import HRCompany from '../model/hr_company_structure.js'
import TravelAllocation from '../model/travel_allocation.js'
import {upload} from '../middlewares/upload.js'
import readXlsxFile from "read-excel-file/node"

const handleUpload = async (req, res) => {
  // Handle the uploaded file
  //console.log(req, 'req.file')
  res.json({ message: 'File uploaded successfully!', fileName: req.file.filename});
}

const createNewHrCompanyInfo = async (req, res) => {

    //do validations here...
    let tenantId = ''  
    const DIY_FLAG = true
    let GROUPING_FLAG = false
    let ORG_HEADERS_FLAG = false
    let companyDetails = {
      companyName:req.companyName,
      companyLogo: '',
      companyEmail: '',
      companyHeadquarters: req.companyHQ,
      companySize: req.teamSize,
      defaultCurrency: '', 
      industry: req.businessCategory,
    }

    const employees = []
    const data=[]

    const bands = new Set()
    const grades = new Set()
    const designations = new Set()

    const profitCenters = new Set()
    const costCenters = new Set()
    const departments = new Set()
    const businessUnits = new Set()
    const legalEntities = new Set()
    const divisions = new Set()
    const projects = new Set()
    const geographicalLocations = new Set()
    const responsibilityCenters = new Set()



  try {
    // get filename from req.body
    const { filename } = req.body;
    const excelFilePath = `uploads/${filename}`

    //read this excel file using xlsx which is in upload folders
    readXlsxFile(excelFilePath).then((rows) => {
      
        rows.map(async (row, index) => {
          if (index > 0) {
              const [
                employeeName,
                employeeId,
                designation,
                grade,
                department,
                businessUnit,
                legalEntity,
                costCenter,
                profitCenter,
                responsibilityCenter,
                division,
                project,
                geographicalLocation,
                l1Manager,
                l2Manager,
                l3Manager,
                joiningDate,
                mobileNumber,
                phoneNumber,
                emailId,
                ]  = [...row]
              
              const employee = {
                employeeDetails:{employeeName,employeeId,designation,grade,department,businessUnit,legalEntity,costCenter,profitCenter,responsibilityCenter,division,project,geographicalLocation,l1Manager,l2Manager,l3Manager,joiningDate,mobileNumber,phoneNumber,emailId},
                group:'',
                employeeRoles:{
                  employee: true,
                  employeeManager: (designation!= null && designation.toLowerCase() === 'manager') ? true : false,
                  finance: false,
                  businessAdmin: false,
                },
                temporaryAssignedManager: {
                  assignedFor: '',
                  approvals: {
                    travelRequest: false,
                    cashAdvance: false,
                    expenseApproval: false,
                  }
                },
                delegated: {
                  delegatedFor: '',
                  endDate: '',
                },
              }
              
              //set other details
              profitCenters.add(profitCenter)
              costCenters.add(costCenter)
              departments.add(department)
              businessUnits.add(businessUnit)
              legalEntities.add(legalEntity)
              divisions.add(division)
              projects.add(project)
              geographicalLocations.add(geographicalLocation)
              responsibilityCenters.add(responsibilityCenter)
             // bands.add(band)
              grades.add(grade)
              designations.add(designation)

              employees.push(employee)
            }
          }
        );

    }
      
    )
    .then(async () => {
          try{

          //generate unique tenantId
          tenantId = Math.random().toString(36).substr(2, 9);

          // Create a new HRCompany document with data from the request body
          const newHRCompany = new HRCompany({
            tenantId: tenantId,
            flags:{
              DIY_FLAG: DIY_FLAG,
              GROUPING_FLAG: GROUPING_FLAG,
              ORG_HEADERS_FLAG: ORG_HEADERS_FLAG,
            },
            companyDetails: companyDetails,
            employees: [...employees],
            groupHeaders: {
              bands: [...bands],
              grades: [...grades],
              designations: [...designations],
            },
            orgHeaders: {
              departments: [...departments],
              legalEntities: [...legalEntities],
              costCenters: [...costCenters],
              profitCenters: [...profitCenters],
              businessUnits: [...businessUnits],
              divisions: [...divisions],
              projects: [...projects],
              geographicalLocations: [...geographicalLocations],
              responsibilityCenters: [...responsibilityCenters],
            }
          });
    
          // Save the new HRCompany document to the database
          
            const savedHRCompany = await newHRCompany.save();
            console.log(savedHRCompany, 'newHRCompany')
            res.status(201).json(savedHRCompany); // Respond with the saved HRCompany data
          }
          catch(error){
            res.status(500).json({ error: 'Internal Server Error' })
            console.log(error, 'error') 
          }
    })

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateExistingHrCompanyInfo = async (req, res) => {
    try {
        // Get the tenantId from the request body
        const { tenantId } = req.body;
    
        // Find the HRCompany document by its tenantId and update it with the data from the request body
        const updatedHRCompany = await HRCompany.findOneAndUpdate({ tenantId: tenantId }, req.body, { new: true });
    
        res.status(200).json(updatedHRCompany); // Respond with the updated HRCompany data
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTenantHRMaster = async (req, res) => {
    try {
        // Get the tenantId from params
        const { tenantId } = req.params;
    
        // Find the HRCompany document by its tenantId
        const hrCompany = await HRCompany.findOne({ tenantId: tenantId });
    
        res.status(200).json(hrCompany); // Respond with the HRCompany data
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTenantEmployees = async (req, res) => {
    try {
        // Get the tenantId from params
        const { tenantId } = req.params;
    
        // Find the HRCompany document by its tenantId
        const hrCompany = await HRCompany.findOne({ tenantId: tenantId });
    
        res.status(200).json(hrCompany.employees); // Respond with the employees data
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateTenantEmployeeDetails = async (req, res) => {
    try {
        // Get the tenantId from params
        const { tenantId } = req.params;
        const { employeeDetails } = req.body;
        console.log(employeeDetails, 'employeeDetails')
        // Get current employees array from the HRCompany document
        let employees = await HRCompany.findOne({ tenantId: tenantId }, {employees:1});

        //update the employees object with the new employeeDetails
        employees.employeeDetails = employeeDetails

        // Find the HRCompany document by its tenantId and update it with the data from the request body
        const updatedHRCompany = await HRCompany.findOneAndUpdate({ tenantId: tenantId }, {$set: employees}, { new: true });
    
        res.status(200).json(updatedHRCompany); // Respond with the updated HRCompany data
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json({ error: 'Internal Server Error'});

    }
}

const getTenantEmployee = async (req, res) => {
    try {
        // Get the tenantId from params
        const { tenantId, employeeId } = req.params;
    
        // Find the HRCompany document by its tenantId
        const hrCompany = await HRCompany.findOne({ tenantId: tenantId });
    
        // Find the employee with the given employeeId
        const employee = hrCompany.employees.find((employee) => employee.employeeDetails.employeeId === employeeId);
    
        res.status(200).json(employee); // Respond with the employee data
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTenantOrgHeaders = async (req, res) => {
    try {
        // Get the tenantId from params
        const { tenantId } = req.params;
    
        // Find the HRCompany document by its tenantId
        const hrCompany = await HRCompany.findOne({ tenantId: tenantId }, {orgHeaders:1});
        res.status(200).json(hrCompany); // Respond with the HRCompany data after removing the employees array
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTenantFlags = async (req, res) => {
    try {
        // Get the tenantId from params
        const { tenantId } = req.params;
    
        // Find the HRCompany document by its tenantId
        const hrCompany = await HRCompany.findOne({ tenantId: tenantId }, {flags:1});
        res.status(200).json(hrCompany); // Respond with the HRCompany data after removing the employees array
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTenantGroupHeaders = async (req, res) => {
    try {
        // Get the tenantId from params
        const { tenantId } = req.params;
    
        // Find the HRCompany document by its tenantId
        const hrCompany = await HRCompany.findOne({ tenantId: tenantId }, {groupHeaders:1});
        res.status(200).json(hrCompany); // Respond with the HRCompany data after removing the employees array
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateTenantOrgHeaders = async (req, res) => {
    try {
        // Get the tenantId from params
        const { tenantId } = req.params;
        const { orgHeaders } = req.body;
        console.log(orgHeaders, 'orgHeaders')

        const hrCompany = await HRCompany.findOne({ tenantId: tenantId });
        hrCompany.orgHeaders = orgHeaders
        // Find the HRCompany document by its tenantId and update it with the data from the request body
        const updatedHRCompany = await HRCompany.findOneAndUpdate({ tenantId: tenantId }, hrCompany, { new: true });
        console.log(updatedHRCompany, 'updatedHRCompany')
        res.status(200).json(updatedHRCompany); // Respond with the updated HRCompany data
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const createTravelAllocation = async (req, res) => {
    try {
        // Get the tenantId from params
        const { tenantId } = req.params;

        const { travelAllocationHeaders } = req.body;
        console.log(travelAllocationHeaders, 'travelAllocationHeaders')

        // Create a new TravelAllocation document with data from the request body
        const newTravelAllocation = new TravelAllocation({tenantId: tenantId, travelAllocationHeaders: travelAllocationHeaders});
    
        // Save the new TravelAllocation document to the database
        const savedTravelAllocation = await newTravelAllocation.save();
    
        res.status(201).json(savedTravelAllocation); // Respond with the saved TravelAllocation data
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export {  createNewHrCompanyInfo, 
          updateExistingHrCompanyInfo, 
          handleUpload,
          getTenantHRMaster,
          getTenantEmployees,
          updateTenantEmployeeDetails,
          getTenantEmployee,
          getTenantFlags,
          getTenantGroupHeaders,
          updateTenantOrgHeaders,
          createTravelAllocation,
          getTenantOrgHeaders, }
