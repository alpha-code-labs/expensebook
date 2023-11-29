import express from 'express'
import HRCompany from '../model/hr_company_structure.js';
import jsonData from '../dummyEmployeeData.json' assert { type: 'json' };

const router = express.Router();

// route for creating an account line document
router.post('/hr-integration', async (req, res) => {
  try {
    console.log('this ran...')
    
    // const {  } = req.body

    // Call the createAccountlineWithTenantId function to create the account line
    const {statusCode, tenantId} = createNewPSTenant(jsonData.employeeData)
    res.status(201).json({message: `Tenant HR added, tenantId: ${tenantId}`});
    
  } catch (error) {
    console.log('Error in integrating tenant data', error);
    res.status(500).json({ error: 'An error occurred while integrating tenant data' });
  }
})


const createNewPSTenant = async (data) => {

  console.log(data, 'data')

  try {
    //do validations here...
    let tenantId = ''  
    const DIY_FLAG = false
    let GROUPING_FLAG = false
    let ORG_HEADERS_FLAG = false
    //const {filename, companyName, companyHQ, teamSize} = req.body
    //console.log(companyName, companyHQ, teamSize, businessCategory, filename, 'req.body')

    let companyDetails = {
      companyName: data.companyName,
      companyLogo: '',
      companyEmail: '',
      companyHeadquarters: '',
      companySize: '',
      defaultCurrency: '', 
      industry: '',
    }


    const employees = []

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

    async function mapData(){
      return new Promise((resolved)=>{
        data.map(async (row, index) => {
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
              ]  = Object.values(row)
            
            const employee = {
              employeeDetails:{employeeName,employeeId,designation,grade,department,businessUnit,legalEntity,costCenter,profitCenter,responsibilityCenter,division,project,geographicalLocation,l1Manager,l2Manager,l3Manager,joiningDate,mobileNumber,phoneNumber,emailId},
              group:[],
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
        )

        resolved()
      })
    }
    
    
    await mapData()
    

      if(departments.length>0 || legalEntities.length>0 || costCenters.length>0 || profitCenters.length>0 || businessUnits.length>0 || divisions.length>0 || projects.length>0 || geographicalLocations.length>0 || responsibilityCenters.length>0 ){
        ORG_HEADERS_FLAG = true
      }

      if(bands.length>0 || grades.length>0 || designations>0 ){
        GROUPING_FLAG = true
      }

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
        band: [...bands],
        grade: [...grades],
        designation: [...designations],
      },
      orgHeaders: {
        department: [...departments],
        legalEntity: [...legalEntities],
        costCenter: [...costCenters],
        profitCenter: [...profitCenters],
        businessUnit: [...businessUnits],
        division: [...divisions],
        project: [...projects],
        geographicalLocation: [...geographicalLocations],
        responsibilityCenter: [...responsibilityCenters],
      },

      //other fields that will be set later - multicurrency, expenseCategories, travelAllocation, travelExpenseAllocation, nonTravelExpenseAllocation
      multiCurrency: [],
      expenseCategories: [],
      travelAllocation: [],
      travelExpenseAllocation: [],
      nonTravelExpenseAllocation: [],
      groupingLabels:[],
      groups:[],
      policies:{
        policyStructure:{},  //possibly we need to set it with the ruleEngineExcel file
        ruleEngine:{}
      }
    });

    // Save the new HRCompany document to the database
    
      const savedHRCompany = await newHRCompany.save();
      console.log(savedHRCompany, 'newHRCompany')
      return {statusCode:200, tenantId}
      

  } catch (error) {
    console.log(error, 'error')
    throw(error)
  }
}


export default router;
