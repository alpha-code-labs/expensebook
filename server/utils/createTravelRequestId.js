
export default function createTravelRequestId(tenantId, employeeId) {

  const travelRequestId = `${tenantId}_${employeeId}_tr_${Date.now()}`
  return travelRequestId
}

