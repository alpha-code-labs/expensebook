const  mongoose = require('mongoose') ;

const nonExpenseSchema = new mongoose.Schema({
  settlementFlag: {type:Boolean} , 
  tripId:"String" , 
  expenseHeaderId : "String" , 
  expenseHeaderStatus: "String" ,
  tenantId: "String" ,
  tenantName: "String" ,
  companyName: "String" ,
  travelRequestId: "String" ,
  expenseHeaderNumber: "String" ,
  expenseHeaderType: "String" ,
  
  createdBy:{
    type:Object
  } , 
 
  
  createdFor :{type : Object} , 
  
  
  teamMembers :{ type : Array} , 
  
  
  alreadyBookedExpenseLines : {type : Array} , 
  
  expenseLines : {type :Array } , 
   
  
  approvers : {type :Array } ,
  
  expenseViolations: {type :Array } ,
  expenseRejectionReason : "String"
  ,
  expenseSubmissionDate : Date ,

})

module.exports = mongoose.model('nonTravelExpense', nonExpenseSchema);






