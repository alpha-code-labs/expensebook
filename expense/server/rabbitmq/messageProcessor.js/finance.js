import Reimbursement from "../../models/reimbursementSchema.js";
import Expense from "../../models/tripSchema.js";

//travel expense header 'paid'
// at line item level also update status of lineItem as paid.
export const settleExpenseReport= async (payload) => {
  try {
      const {  tenantId,travelRequestId, expenseHeaderId, settlementBy, expenseHeaderStatus, 
        settlementDate } = payload;
  
        const status = {
          PENDING_SETTLEMENT: 'pending settlement',
          PAID: 'paid',
          APPROVED:'approved'
        };

        const arrayFilters = [
          {'elem.expenseHeaderId': expenseHeaderId },
          {'lineItem.lineItemStatus':status.APPROVED}
        ];
    const trip = await Expense.findOneAndUpdate(
      { 
        'tenantId': tenantId,
         
        'travelExpenseData': { $elemMatch: { travelRequestId, expenseHeaderId } }
      },
      { 
        $set: { 
          'travelExpenseData.$[elem].expenseHeaderStatus': expenseHeaderStatus, 
          'travelExpenseData.$[elem].settlementDate': settlementDate,
          'travelExpenseData.$[elem].settlementBy': settlementBy,
          'travelExpenseData.$[elem].settlementDate': new Date(),
          'travelExpenseData.$[elem].expenseLines.$[lineItem].lineItemStatus': status.PAID,
        }
      },
      { arrayFilters,new: true }
    );

    console.log('Travel request status updated in approval microservice:', JSON.stringify(trip,'',2));
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update travel request status in approval microservice:', error);
    return { success: false, error: error };
  }
};


export const settleExpenseReportPaidAndDistributed= async (payload) => {
    try {
      const { tenantId, expenseHeaderId, tripId, paidBy, } = payload;
  
      const trip = await Expense.findOneAndUpdate(
        { 
          tenantId,
          tripId,
          'travelExpenseData': { $elemMatch: {'expenseHeaderId': expenseHeaderId } }
        },
        { 
          $set: { 
            'travelExpenseData.$.expenseHeaderStatus': 'paid and distributed', 
            'travelExpenseData.$.paidBy': paidBy ?? '', 
          }
        },
        { new: true }
      );
  
      console.log('Travel request status updated in approval microservice:', trip);
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to update travel request status in approval microservice:', error);
      return { success: false, error: error };
    }
};

//settle cashAdvance
export const settleOrRecoverCashAdvance = async (payload) => {
    try {
      const { tenantId, travelRequestId, cashAdvanceId, paidBy ,cashAdvanceStatus,paidFlag,
          recoveredBy,recoveredFlag,
      } = payload;
  
      console.log("settle ca payload", payload)
      const updateCashDoc = {
          'cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus, 
      }

      if(paidBy !== undefined && paidFlag !== undefined){
        updateCashDoc['cashAdvancesData.$.paidBy'] = paidBy,
        updateCashDoc['cashAdvancesData.$.paidFlag'] = paidFlag
      }

      if(recoveredBy !== undefined && recoveredFlag !== undefined){
        updateCashDoc['cashAdvancesData.$.recoveredBy'] = recoveredBy,
        updateCashDoc['cashAdvancesData.$.recoveredFlag'] = recoveredFlag
      }

      const isFound = await Expense.findOne(
        { 
          tenantId,
          'cashAdvancesData': { $elemMatch: { cashAdvanceId,travelRequestId } }
        },)

        console.log("isFound", JSON.stringify(isFound,'',2))
      const trip = await Expense.findOneAndUpdate(
        { 
          tenantId,
          'cashAdvancesData': { $elemMatch: { cashAdvanceId,travelRequestId } }
        },
        { 
          $set: updateCashDoc
        },
        { new: true }
      );
  
      if(!trip){
      throw new Error('cash advance status change to paid failed : while updating db')
      }
      console.log('Travel request status updated in approval microservice:', trip);
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to update travel request status in approval microservice:', error.message);
      return { success: false, error: error.message };
    }
};


export const settleNonTravelExpenseReport= async (payload) => {
  try {
      const {  tenantId, expenseHeaderId, settlementBy, expenseHeaderStatus, 
        settlementDate } = payload;

        console.log("non travel settlement", payload)
        const status = {
          PENDING_SETTLEMENT: 'pending settlement',
          PAID: 'paid',
          APPROVED:'approved'
        };
        
        const filter = {
          tenantId,
          expenseHeaderId,
          'expenseHeaderStatus': status.PENDING_SETTLEMENT,
        };
        
        // Use findOneAndUpdate to find and update in one operation
        const updateResult = await Reimbursement.findOne(
          filter,
        );

        if(!updateResult){
          throw new Error('non travel expense report not found in dashboard ms')
        }

        const {expenseLines} = updateResult

        const updatedExpenseLines = expenseLines.map((line) => {
          if(line.lineItemStatus == status.APPROVED){
            return{
              ...line,
              lineItemStatus: status.PAID,
              actionedUpon:true,
              settlementBy: settlementBy,
              expenseSettledDate:settlementDate,
            }
          }
          return line
        })

        updateResult.expenseLines = updatedExpenseLines
        updateResult.settlementBy = settlementBy
        updateResult.expenseHeaderStatus = expenseHeaderStatus
        updateResult.settlementDate = settlementDate
        updateResult.actionedUpon = true
        
      const report =  await updateResult.save()
    console.log('Travel request status updated in expense microservice:', JSON.stringify(report,'',2));
    const {expenseHeaderStatus:getStatus} = report

    if(getStatus === status.PAID){
      return { success: true, error: null };
    }
    return { success: false, error:`non Travel expense report has ${getStatus} as expenseHeaderStatus` };
  } catch (error) {
    console.error('Failed to update travel request status in expense microservice:', error);
    return { success: false, error: error.message };
  }
};





