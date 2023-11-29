import HRCompany from "../model/hr_company_structure.js"

async function updateAccountLinesAndExpenseCategories(tenantId){

    try{    
    
        const hrCompany = await HRCompany.findOne({tenantId}, {tenantId:1, policies:1, accountLines:1})
        const policies = hrCompany.policies
        const accountLines = hrCompany.accountLines

        //predefined categories
        //flight ticket number, total cost,
        const predefinedCategories = [{categoryName:'Flight', fields:[]}, {categoryName:'Train', fields:[]}, {categoryName:'Cab', fields:[]}] 
        
        console.log(policies)
        console.log(policies.length, 'length')
        console.log(Array.isArray(policies), 'is array')
        console.log(Object.keys(policies), 'keys')
        //check if policies have non travel expense data
        if(policies.length>0){
          console.log('this ran..')
          const group = Object.keys(policies[0])[0] 
          const nonTravelPolicies = policies[0][group]['nonTravel']
          
          //get category names and fields from non-travel policies
          const nonTravelExpenseCategories = Object.keys(nonTravelPolicies).map(key=>{
                if(Object.keys(nonTravelPolicies[key]).includes('fields')){
                  return({categoryName:key, fields:nonTravelPolicies[key]['fields']})
                }
              }).filter(vals=>vals!=null)


          //update expense categories####
          await HRCompany.findOneAndUpdate({tenantId}, {$set: {expenseCategories:nonTravelExpenseCategories}})
          console.log('expense categories updated')

          const expenseCategoriesNames = [...predefinedCategories, ...nonTravelExpenseCategories].map(category=>category.categoryName)
          const accountLineNames = accountLines.map(accLine=>accLine.categoryName.toLowerCase())
          
          //check if account lines contain all expense categories, if not update them
          expenseCategoriesNames.forEach(categoryName=>{
            if(!accountLineNames.includes(categoryName.toLowerCase())){
                console.log('added category to account line', categoryName)
                accountLines.push({categoryName:categoryName, accountLine:''})
            }
          })

          const accountLines_copy = JSON.parse(JSON.stringify(accountLines))

          //check if there are extra account lines that are not present in expense categories if so remove them
          accountLines.forEach((accountLine, index)=>{
            if(!expenseCategoriesNames.includes(accountLine.categoryName)){
                //remove account line
                console.log('removed...', accountLine.categoryName)
                accountLines_copy.splice(index,1)
            }
          })

          //update account lines####
          await HRCompany.findOneAndUpdate({tenantId}, {$set: {accountLines:accountLines_copy}})
          console.log('account lines updated')

        }
        else{
          //set account lines to default values

          //update account lines####
          await HRCompany.findOneAndUpdate({tenantId}, {$set: {accountLines:predefinedCategories.map(category=>({categoryName:category, accountLine:''}))}})
          console.log('account lines updated to default')
        }
        
      }
      catch(e){
        console.log(e)
        }
}

export {updateAccountLinesAndExpenseCategories}