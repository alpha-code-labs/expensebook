let incrementalNumber = 0;

export default function createTravelRequestId(tenantId, employeeId) {
  // Increment the number for each request
  incrementalNumber++;

  const paddedNumber = String(incrementalNumber).padStart(6, '0');
  const travelRequestId = `${tenantId}_${employeeId}_tr_${paddedNumber}`
  return travelRequestId
}

