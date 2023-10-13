export default function createCashAdvanceId(tenantId, cashAdvanceCreatedBy) {
  const randomDigit = Math.floor(Math.random() * 900000) + 100000;
  const cashAdvanceId = `${tenantId}_${cashAdvanceCreatedBy}_CA_${randomDigit}`;
  return cashAdvanceId;
}



  