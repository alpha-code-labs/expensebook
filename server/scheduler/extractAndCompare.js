import { fetchTravelRequestData } from '../services/travelService.js';
import { fetchCashAdvanceDataWithBookedTravel } from '../services/cashService.js';

export const extractAndCompareData = async () => {
  try {
    const travelRequestsData = await fetchTravelRequestData();
    const cashAdvancesData = await fetchCashAdvanceDataWithBookedTravel();
    
    // Check if the fetched data is an array
    if (!Array.isArray(travelRequestsData)) {
      throw new Error('Travel requests data is not an array');
    }

    if (!Array.isArray(cashAdvancesData)) {
      throw new Error('Cash advances data is not an array');
    }
    
    const uniqueTravelRequests = new Set(travelRequestsData.map(request => request.travelRequestId));
    const uniqueCashAdvances = new Set(cashAdvancesData.map(advance => advance.travelRequestId));
    
    const travelRequestMap = new Map(travelRequestsData.map(request => [request.travelRequestId, request]));
    const cashAdvanceMap = new Map(cashAdvancesData.map(advance => [advance.travelRequestId, advance]));

    return {
      uniqueTravelRequests: [...uniqueTravelRequests],
      uniqueCashAdvances: [...uniqueCashAdvances],
      travelRequestMap,
      cashAdvanceMap,
    };
  } catch (error) {
    console.error('An error occurred in extractAndCompareData:', error.message);
    throw error;
  }
};
