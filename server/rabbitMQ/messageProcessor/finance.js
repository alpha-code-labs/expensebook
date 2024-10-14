import CashAdvance from "../../models/cashSchema.js"


/*
payload for settling cash advance: 
cashAdvancId,
cashAdvanceStatus,
 */

export async function settleCashAdvance(payload /* */){
    try{
        const {travelRequestId, cashAdvanceId, cashAdvanceStatus, paidBy} = payload
        console.log(JSON.stringify(payload));
        const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId' : travelRequestId}) 
        if(!cashAdvance) return {success:false, error: 'Travel Request not found', dashBoardPayload:{}}
        
        cashAdvance.cashAdvancesData.forEach(ca=>{
            if(ca.cashAdvanceId == cashAdvanceId){
                ca.cashAdvanceStatus = cashAdvanceStatus
                ca.paidBy = paidBy

                console.log(cashAdvance.cashAdvancesData, 'advances data after processing')
            }
        })

        const result = await cashAdvance.save()

        return {success:true, error:null, dashBoardPayload:result}
    }catch(e){
        return {success:false, error:e, dashBoardPayload:{}}
        
    }
}

export async function recoveryCashAdvance(payload /* */){
    try{
        const {travelRequestId, cashAdvanceId, cashAdvanceStatus, settlementDetails} = payload
        
        const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId' : travelRequestId}) 
        if(!cashAdvance) return {success:false, error: 'Travel Request not found', dashBoardPayload:{}}

        cashAdvance.cashAdvancesData.forEach(ca=>{
            if(ca.cashAdvanceId == cashAdvanceId){
                ca.cashAdvanceStatus = cashAdvanceStatus
                ca.paidBy = paidBy
                ca.settlementDetails = settlementDetails
            }
        })

        const result = await cashAdvance.save()

        return {success:true, error:null, dashBoardPayload:result}
    }catch(e){
        return {success:false, error:e, dashBoardPayload:{}}
        
    }
}



