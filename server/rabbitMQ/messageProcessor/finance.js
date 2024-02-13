import CashAdvance from "../../models/cashSchema.js"


/*
payload for settling cash advance:
cashAdvancId,
cashAdvanceStatus,
 */

export async function settleCashAdvance(payload /* */){
    try{
        const {travelRequestId, cashAdvanceId, cashAdvanceStatus, paidBy} = payload
        
        const cashAdvance = CashAdvance.findOne({'travelRequestData.travelRequestId' : travelRequestId}) 
        if(!cashAdvance) return {success:false, error: 'Travel Request not found', dashBoardPayload:{}}

        cashAdvance.cashAdvanceData.forEach(ca=>{
            if(ca.cashAdvanceId == cashAdvanceId){
                cashAdvance.cashAdvanceData.cashAdvanceStatus = cashAdvanceStatus
                cashAdvance.cashAdvanceData.paidBy = paidBy
            }
        })

        const result = cashAdvance.save()

        return {success:true, error:null, dashBoardPayload:result}
    }catch(e){
        return {success:false, error:e, dashBoardPayload:{}}
        
    }
}

export async function recoveryCashAdvance(payload /* */){
    try{
        const {travelRequestId, cashAdvanceId, cashAdvanceStatus} = payload
        
        const cashAdvance = CashAdvance.findOne({'travelRequestData.travelRequestId' : travelRequestId}) 
        if(!cashAdvance) return {success:false, error: 'Travel Request not found', dashBoardPayload:{}}

        cashAdvance.cashAdvanceData.forEach(ca=>{
            if(ca.cashAdvanceId == cashAdvanceId){
                cashAdvance.cashAdvanceData.cashAdvanceStatus = cashAdvanceStatus
                cashAdvance.cashAdvanceData.paidBy = paidBy
            }
        })

        const result = cashAdvance.save()

        return {success:true, error:null, dashBoardPayload:result}
    }catch(e){
        return {success:false, error:e, dashBoardPayload:{}}
        
    }
}
