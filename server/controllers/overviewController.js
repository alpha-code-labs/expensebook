import mongoose from "mongoose";
import Dashboard from "../models/dashboardSchema.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";

/// Validate flight details
const validateFlightDetails = (flightDetails) => {
  return (
    flightDetails &&
    flightDetails.from &&
    flightDetails.to &&
    flightDetails.date &&
    flightDetails.time
  );
};

// Update line item status based on approvers (approval setup is done while raising travel request)
const updateLineItemStatus = (approvers) => {
  const currentLineItemStatus =
    approvers && approvers.length > 0 ? "pending approval" : "pending booking";
  console.log(`Current line item status: ${currentLineItemStatus}`);
  return currentLineItemStatus;
};

// 1) Add a flight/flights to exiting trip
export const addFlight = async (req, res) => {
  try {
    // Extract parameters from request
    const { tenantId, tripId, empId } = req.params;
    const { flightDetails } = req.body;

    // Input validation
    if (!tripId || !tenantId || !empId) {
      return res
        .status(400)
        .json({
          error: "Invalid input, please provide valid tripId, tenantId, empId",
        });
    }

    // Validate flight details
    if (
      !flightDetails ||
      !Array.isArray(flightDetails) ||
      flightDetails.length === 0
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid flight details, please provide an array of flight details",
        });
    }

    const trip = await Dashboard.findOne({
      tenantId,
      "tripSchema.tripStatus": { $in: ["transit", "upcoming"] },
      "tripSchema.tripId": tripId,
      $or: [
        { "tripSchema.travelRequestData.createdBy.empId": empId },
        { "tripSchema.travelRequestData.createdFor.empId": empId },
      ],
    });

    if (!trip) {
      return res
        .status(404)
        .json({ error: "Trip not found or not in transit" });
    }

    if (trip) {
      let payload = [];
      let itineraryDetails;

      let {
        travelRequestId,
        isCashAdvanceTaken,
        itinerary,
        approvers,
        isAddALeg,
      } = trip.tripSchema.travelRequestData;
      const { flights } = itinerary || { flights: [] };

      let isAddALegFlag = true;
      trip.tripSchema.travelRequestData.isAddALeg = isAddALegFlag;

      payload.push({ travelRequestId });

      flightDetails.forEach((newFlight) => {
        itineraryDetails = {
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          ...initializeFields(), // Initialize all fields to null
          ...newFlight,
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({
            empId: approver.empId,
            name: approver.name,
            status: "pending approval",
          })),
        };
        console.log("flight", itineraryDetails);

        flights.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.tripSchema.travelRequestData.itinerary.flights = flights;
      console.log("the payload ....", itineraryDetails);
      const updatedTrip = await trip.save();

      if (!updatedTrip) {
        return res.status(500).json({ error: "Failed to save trip" });
      } else {
        console.log("the itinerary ..........", itineraryDetails);
        const flightsArray =
          updatedTrip.tripSchema.travelRequestData.itinerary.flights;
        const flightsAdded =
          flightsArray.length > 0 ? flightsArray[flightsArray.length - 1] : 0;

        console.log("retriving from flights array", flightsAdded);

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: flightsAdded,
          itineraryType: "flights",
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };

        if (approvers && approvers?.length > 0) {
          console.log("Approvers found for this trip:", approvers);
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "approval",
            "to update itinerary added to travelRequestData for trips"
          );
        }

        if (isCashAdvanceTaken) {
          console.log("Is cash advance taken:", isCashAdvanceTaken);
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "cash",
            "to update itinerary added to travelRequestData for trips"
          );
        } else {
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "travel",
            "to update itinerary added to travelRequestData for trips"
          );
        }
      }

      return res
        .status(200)
        .json({
          success: true,
          message: "flights added successfully",
          trip: updatedTrip,
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to add flights ", error });
  }
};

//  Validate bus details
const validateBusDetails = (busDetails) => {
  return (
    busDetails &&
    busDetails.from &&
    busDetails.to &&
    busDetails.date &&
    busDetails.time
  );
};

// 2) Add a bus/buses to exiting trip
export const addBus = async (req, res) => {
  try {
    // Extract parameters from request
    const { tenantId, tripId, empId } = req.params;
    const { busDetails } = req.body;

    // Input validation
    if (!tripId || !tenantId || !empId) {
      return res
        .status(400)
        .json({
          error: "Invalid input, please provide valid tripId, tenantId, empId",
        });
    }

    // Validate bus details
    if (!busDetails || !Array.isArray(busDetails) || busDetails.length === 0) {
      return res
        .status(400)
        .json({
          error: "Invalid bus details, please provide an array of bus details",
        });
    }

    const trip = await Dashboard.findOne({
      tenantId,
      "tripSchema.tripStatus": { $in: ["transit", "upcoming"] },
      "tripSchema.tripId": tripId,
      $or: [
        { "tripSchema.travelRequestData.createdBy.empId": empId },
        { "tripSchema.travelRequestData.createdFor.empId": empId },
      ],
    });

    if (!trip) {
      return res
        .status(404)
        .json({ error: "Trip not found or not in transit" });
    }

    if (trip) {
      let payload = [];
      let {
        travelRequestId,
        isCashAdvanceTaken,
        itinerary,
        approvers,
        isAddALeg,
      } = trip.tripSchema.travelRequestData;
      const { buses } = itinerary || { buses: [] };

      let isAddALegFlag = true;
      trip.tripSchema.travelRequestData.isAddALeg = isAddALegFlag;

      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      busDetails.forEach((newBus) => {
        const itineraryDetails = {
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          ...initializeFields(), // Initialize all fields to null
          ...newBus,
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({
            empId: approver.empId,
            name: approver.name,
            status: "pending approval",
          })),
        };
        console.log("bus", itineraryDetails);

        buses.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.tripSchema.travelRequestData.itinerary.buses = buses;

      const updatedTrip = await trip.save();

      if (!updatedTrip) {
        return res.status(500).json({ error: "Failed to save trip" });
      } else {
        console.log(
          "after saving hotel",
          updatedTrip.tripSchema.travelRequestData.itinerary.buses.length - 1
        );
        const busesArray =
          updatedTrip.tripSchema.travelRequestData.itinerary.buses;
        const busesAdded =
          busesArray.length > 0 ? busesArray[busesArray.length - 1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: busesAdded,
          itineraryType: "buses",
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };

        if (approvers && approvers?.length > 0) {
          console.log("Approvers found for this trip:", approvers);
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "approval",
            "to update itinerary added to travelRequestData for trips"
          );
        }

        if (isCashAdvanceTaken) {
          console.log("Is cash advance taken:", isCashAdvanceTaken);
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "cash",
            "to update itinerary added to travelRequestData for trips"
          );
        } else {
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "travel",
            "to update itinerary added to travelRequestData for trips"
          );
        }
      }

      return res
        .status(200)
        .json({
          success: true,
          message: "Buses added successfully",
          trip: updatedTrip,
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to add Buses ", error });
  }
};

// Validate train details
const validateTrainDetails = (trainDetails) => {
  return (
    trainDetails &&
    trainDetails.from &&
    trainDetails.to &&
    trainDetails.date &&
    trainDetails.time
  );
};

// 3) Add a train/trains details via dashboard
export const addTrain = async (req, res) => {
  try {
    // Extract parameters from request
    const { tenantId, tripId, empId } = req.params;
    const { trainDetails } = req.body;

    // Input validation
    if (!tripId || !tenantId || !empId) {
      return res
        .status(400)
        .json({
          error: "Invalid input, please provide valid tripId, tenantId, empId",
        });
    }

    // Validate train details
    if (
      !trainDetails ||
      !Array.isArray(trainDetails) ||
      trainDetails.length === 0
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid train details, please provide an array of train details",
        });
    }

    const trip = await Dashboard.findOne({
      tenantId,
      "tripSchema.tripStatus": { $in: ["transit", "upcoming"] },
      "tripSchema.tripId": tripId,
      $or: [
        { "tripSchema.travelRequestData.createdBy.empId": empId },
        { "tripSchema.travelRequestData.createdFor.empId": empId },
      ],
    });

    if (!trip) {
      return res
        .status(404)
        .json({ error: "Trip not found or not in transit" });
    }

    if (trip) {
      let payload = [];
      let {
        travelRequestId,
        isCashAdvanceTaken,
        itinerary,
        approvers,
        isAddALeg,
      } = trip.tripSchema.travelRequestData;
      const { trains } = itinerary || { trains: [] };

      let isAddALegFlag = true;
      trip.tripSchema.travelRequestData.isAddALeg = isAddALegFlag;

      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      trainDetails.forEach((newTrain) => {
        const itineraryDetails = {
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          ...initializeFields(), // Initialize all fields to null
          ...newTrain,
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({
            empId: approver.empId,
            name: approver.name,
            status: "pending approval",
          })),
        };
        console.log("Train", itineraryDetails);

        trains.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.tripSchema.travelRequestData.itinerary.trains = trains;

      const updatedTrip = await trip.save();

      if (!updatedTrip) {
        return res.status(500).json({ error: "Failed to save trip" });
      } else {
        console.log(
          "after saving Train",
          updatedTrip.tripSchema.travelRequestData.itinerary.trains.length - 1
        );
        const trainsArray =
          updatedTrip.tripSchema.travelRequestData.itinerary.trains;
        const trainsAdded =
          trainsArray.length > 0 ? trainsArray[trainsArray.length - 1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: trainsAdded,
          itineraryType: "trains",
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };

        if (approvers && approvers?.length > 0) {
          console.log("Approvers found for this trip:", approvers);
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "approval",
            "to update itinerary added to travelRequestData for trips"
          );
        }

        if (isCashAdvanceTaken) {
          console.log("Is cash advance taken:", isCashAdvanceTaken);
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "cash",
            "to update itinerary added to travelRequestData for trips"
          );
        } else {
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "travel",
            "to update itinerary added to travelRequestData for trips"
          );
        }
      }

      return res
        .status(200)
        .json({
          success: true,
          message: "train added successfully",
          trip: updatedTrip,
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to add trains ", error });
  }
};

// Validate cab details
const validateCabDetails = (cabDetails) => {
  return (
    cabDetails &&
    cabDetails.from &&
    cabDetails.to &&
    cabDetails.date &&
    cabDetails.time
  );
};

// 4) add cabs to existing trip via dashboard- overview
export const addCab = async (req, res) => {
  try {
    // Extract parameters from request
    const { tenantId, tripId, empId } = req.params;
    const { cabDetails } = req.body;

    // Input validation
    if (!tripId || !tenantId || !empId) {
      return res
        .status(400)
        .json({
          error: "Invalid input, please provide valid tripId, tenantId, empId",
        });
    }

    // Validate cab details
    if (!cabDetails || !Array.isArray(cabDetails) || cabDetails.length === 0) {
      return res
        .status(400)
        .json({
          error: "Invalid cab details, please provide an array of cab details",
        });
    }

    const trip = await Dashboard.findOne({
      tenantId,
      "tripSchema.tripStatus": { $in: ["transit", "upcoming"] },
      "tripSchema.tripId": tripId,
      $or: [
        { "tripSchema.travelRequestData.createdBy.empId": empId },
        { "tripSchema.travelRequestData.createdFor.empId": empId },
      ],
    });

    if (!trip) {
      return res
        .status(404)
        .json({ error: "Trip not found or not in transit" });
    }

    if (trip) {
      let payload = [];
      let {
        travelRequestId,
        isCashAdvanceTaken,
        itinerary,
        approvers,
        isAddALeg,
      } = trip.tripSchema.travelRequestData;
      const { cabs } = itinerary || { cabs: [] };

      let isAddALegFlag = true;
      trip.tripSchema.travelRequestData.isAddALeg = isAddALegFlag;

      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      cabDetails.forEach((newCab) => {
        const itineraryDetails = {
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          ...initializeCabFields(), // Initialize all fields to null
          ...newCab,
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({
            empId: approver.empId,
            name: approver.name,
            status: "pending approval",
          })),
        };
        console.log("cabs", itineraryDetails);

        cabs.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.tripSchema.travelRequestData.itinerary.cabs = cabs;

      const updatedTrip = await trip.save();

      if (!updatedTrip) {
        return res.status(500).json({ error: "Failed to save trip" });
      } else {
        console.log(
          "after saving hotel",
          updatedTrip.tripSchema.travelRequestData.itinerary.cabs.length - 1
        );
        const cabsArray =
          updatedTrip.tripSchema.travelRequestData.itinerary.cabs;
        const cabsAdded =
          cabsArray.length > 0 ? cabsArray[cabsArray.length - 1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: cabsAdded,
          itineraryType: "cabs",
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };

        if (approvers && approvers?.length > 0) {
          console.log("Approvers found for this trip:", approvers);
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "approval",
            "to update itinerary added to travelRequestData for trips"
          );
        }

        if (isCashAdvanceTaken) {
          console.log("Is cash advance taken:", isCashAdvanceTaken);
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "cash",
            "to update itinerary added to travelRequestData for trips"
          );
        } else {
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "travel",
            "to update itinerary added to travelRequestData for trips"
          );
        }
      }

      return res
        .status(200)
        .json({
          success: true,
          message: "cabs added successfully",
          trip: updatedTrip,
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to add cabs ", error });
  }
};

// Validate hotel details
const validateHotelDetails = (hotelDetails) => {
  return (
    hotelDetails &&
    hotelDetails.hotelName &&
    hotelDetails.checkIn &&
    hotelDetails.checkOut
  );
};

// 5) Add hotel details via dashboard
export const addHotel = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;
    const { hotelDetails } = req.body;

    if (!tripId || !tenantId || !empId) {
      return res
        .status(400)
        .json({
          error: "Invalid input, please provide valid tripId, tenantId, empId",
        });
    }

    if (
      !hotelDetails ||
      !Array.isArray(hotelDetails) ||
      hotelDetails.length === 0
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid hotel details, please provide an array of hotel details",
        });
    }

    const trip = await Dashboard.findOne({
      tenantId,
      "tripSchema.tripStatus": { $in: ["transit", "upcoming"] },
      "tripSchema.tripId": tripId,
      $or: [
        { "tripSchema.travelRequestData.createdBy.empId": empId },
        { "tripSchema.travelRequestData.createdFor.empId": empId },
      ],
    });

    if (!trip) {
      return res
        .status(404)
        .json({ error: "Trip not found or not in transit" });
    }

    if (trip) {
      let payload = [];
      let {
        travelRequestId,
        isCashAdvanceTaken,
        itinerary,
        approvers,
        isAddALeg,
      } = trip.tripSchema.travelRequestData;
      const { hotels } = itinerary || { hotels: [] };

      let isAddALegFlag = true;
      trip.tripSchema.travelRequestData.isAddALeg = isAddALegFlag;

      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      hotelDetails.forEach((newHotel) => {
        const itineraryDetails = {
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          ...initializeHotelFields(), // Initialize all fields to null
          ...newHotel,
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({
            empId: approver.empId,
            name: approver.name,
            status: "pending approval",
          })),
        };
        console.log("hotel", itineraryDetails);

        hotels.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.tripSchema.travelRequestData.itinerary.hotels = hotels;

      const updatedTrip = await trip.save();

      if (!updatedTrip) {
        return res.status(500).json({ error: "Failed to save trip" });
      } else {
        console.log(
          "after saving hotel",
          updatedTrip.tripSchema.travelRequestData.itinerary.hotels.length - 1
        );
        const hotelsArray =
          updatedTrip.tripSchema.travelRequestData.itinerary.hotels;
        const hotelAdded =
          hotelsArray.length > 0 ? hotelsArray[hotelsArray.length - 1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: hotelAdded,
          itineraryType: "hotels",
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };

        console.log("data to send", dataToSend.hotel);

        if (approvers && approvers?.length > 0) {
          console.log("Approvers found for this trip:", approvers);
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "approval",
            "to update itinerary added to travelRequestData for trips"
          );
        }

        if (isCashAdvanceTaken) {
          console.log("Is cash advance taken:", isCashAdvanceTaken);
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "cash",
            "to update itinerary added to travelRequestData for trips"
          );
        } else {
          await sendToOtherMicroservice(
            dataToSend,
            "add-leg",
            "travel",
            "to update itinerary added to travelRequestData for trips"
          );
        }
      }

      return res
        .status(200)
        .json({
          success: true,
          message: "Hotels added successfully",
          trip: updatedTrip,
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to add Hotel ", error });
  }
};

const initializeHotelFields = () => ({
  location: null,
  locationPreference: null,
  class: null,
  checkIn: null,
  checkOut: null,
  checkInTime: null,
  checkOutTime: null,
  violations: {
    class: null,
    amount: null,
  },
  bkd_location: null,
  bkd_locationPreference: null,
  bkd_class: null,
  bkd_checkIn: null,
  bkd_checkOut: null,
  bkd_checkInTime: null,
  bkd_checkOutTime: null,
  bkd_violations: {
    class: null,
    amount: null,
  },
  modified: null,
  cancellationDate: null,
  cancellationReason: null,
  rejectionReason: null,
  status: {
    type: null,
  },
  approvers: [
    {
      empId: null,
      name: null,
      status: "pending approval",
    },
  ],
  bookingDetails: {
    docURL: null,
    docType: null,
    billDetails: {
      vendorName: null,
      totalAmount: null,
      taxAmount: null,
    },
  },
});

const initializeCabFields = () => ({
  itineraryId: new mongoose.Types.ObjectId(),
  formId: new mongoose.Types.ObjectId().toString(),
  date: null,
  class: null,
  preferredTime: null,
  pickupAddress: null,
  dropAddress: null,
  isReturnTravel: null,
  violations: {
    class: null,
    amount: null,
  },
  bkd_date: null,
  bkd_class: null,
  bkd_preferredTime: null,
  bkd_pickupAddress: null,
  bkd_dropAddress: null,
  bkd_isReturnTravel: null,
  bkd_violations: {
    class: null,
    amount: null,
  },
  modified: null,
  cancellationDate: null,
  cancellationReason: null,
  rejectionReason: null,
  status: null,
  approvers: [
    {
      empId: null,
      name: null,
      status: "pending approval",
    },
  ],
  bookingDetails: {
    docURL: null,
    docType: null,
    billDetails: {
      vendorName: null,
      totalAmount: null,
      taxAmount: null,
    },
  },
  type: null,
});

const initializeFields = () => ({
  itineraryId: new mongoose.Types.ObjectId(),
  formId: new mongoose.Types.ObjectId().toString(),
  from: null,
  to: null,
  date: null,
  time: null,
  travelClass: null,
  isReturnTravel: null,
  violations: {
    class: null,
    amount: null,
  },
  bkd_from: null,
  bkd_to: null,
  bkd_date: null,
  bkd_time: null,
  bkd_travelClass: null,
  bkd_isReturnTravel: null,
  bkd_violations: {
    class: null,
    amount: null,
  },
  modified: null,
  cancellationDate: null,
  cancellationReason: null,
  rejectionReason: null,
  status: null,
  approvers: [
    {
      empId: null,
      name: null,
      status: "pending approval",
    },
  ],
  bookingDetails: {
    docURL: null,
    docType: null,
    billDetails: {
      vendorName: null,
      totalAmount: null,
      taxAmount: null,
    },
  },
});
