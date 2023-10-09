import axios from "axios";

const sampleTravelRequest = {
    tenantId: "123",
    travelRequestId: "123_employee1_tr_#1",
    travelRequestStatus: "draft",
    travelRequestState: "section 0",
    createdBy: [{ empId: "employee1", name: "John Doe" }],
    createdFor: [{ empId: "employee2", name: "Jane Smith" }],
    travelAllocationHeaders: [
      {
        department: "Finance",
        percentage: 60,
      },
      {
        department: "Marketing",
        percentage: 40,
      },
    ],
    itinerary: {
      cities: [
        {
          from: "City A",
          to: "City B",
          departure: { date: "2023-10-15", time: "08:00 AM" },
          return: { date: "2023-10-20", time: "06:00 PM" },
        },
      ],
      hotels: [
        {
          class: "4-star",
          checkIn: "2023-10-15",
          checkOut: "2023-10-20",
        },
      ],
      cabs: [],
      modeOfTransit: "Flight",
      travelClass: "Business",
      needsVisa: true,
      needsAirportTransfer: true,
      needsHotel: true,
      needsFullDayCabs: false,
      tripType: { oneWayTrip: false, roundTrip: true, multiCityTrip: false },
    },
    travelDocuments: ["Passport", "Visa"],
    bookings: [
      {
        vendorName: "Airline XYZ",
        billNumber: "12345",
        billDescription: "Flight booking",
        grossAmount: 1200,
        taxes: 100,
        date: "2023-09-20",
        imageUrl: "https://example.com/receipt-image.png",
      },
      {
        vendorName: "Hotel ABC",
        billNumber: "67890",
        billDescription: "Hotel booking",
        grossAmount: 500,
        taxes: 50,
        date: "2023-09-25",
        imageUrl: "https://example.com/hotel-receipt.png",
      },
    ],
    approvers: ["approver1", "approver2"],
    preferences: ["Non-smoking room", "Vegetarian meals"],
    travelViolations: ["None"],
    travelRequestDate: "2023-09-10",
    travelBookingDate: "2023-09-20",
    travelCompletionDate: "2023-10-21",
    travelRequestRejectionReason: "",
    travelAndNonTravelPolicies: {
      travelPolicies: ["Policy 1", "Policy 2"],
      nonTravelPolicies: ["Policy A", "Policy B"],
    },
  };


async function postTravelRequest_API(data){
    let travelRequestId = null

    await axios.post('http://localhost:8001/travel/api/travel-request', data).
    then((res) => { console.log(res); travelRequestId = res.data.travelRequestId }).
    catch((err) => { console.log(err) });

    return travelRequestId;
}

async function updateTravelRequest_API(data){
    let response = null

    await axios.patch(`http://localhost:8001/travel/api/travel-requests/${data.travelRequestId}`, data).
    then((res) => { console.log(res); response = res.data }).
    catch((err) => { console.log(err) });

    return response;
}


export { postTravelRequest_API, updateTravelRequest_API };


