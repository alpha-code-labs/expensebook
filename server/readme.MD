
// 1 --get cash Advances for settlement 
http://localhost:6098/api/cashAdvance/find/660a58ac1a308ce97b32213f

// 2- --get reimbursement 
http://localhost:6098/api/reimbursement/find/660a58ac1a308ce97b32213f

//3- --get travelExpense reports
http://localhost:6098/api/travelExpense/find/660a58ac1a308ce97b32213f

http://localhost:6098/api/cashAdvance/settlement/660a58ac1a308ce97b32213f/


1)cash schema newly added 
 settlementFlag: {
      type:Boolean,
      required:true,
      default:false,
    },
    actionedUpon:{
      type:Boolean,
      required:true,
      default:false,
    },
    cashSetteledBy:{
      empId:{type: String, default:null},
      name:{type: String, default:null}
    },