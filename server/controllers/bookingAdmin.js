import Joi from "joi";
import dashboard from "../models/dashboardSchema.js";
import HRMaster from "../models/hrMasterSchema.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";
import { employeeSchema } from "./profileController.js";

// 2) cancel at header level - for upcoming/completed trips only --( header level cancel is allowed to upcoming and completed trips , not allowed for transit trips)
// Line item cancel
export const cancelTripAtHeaderLevel = async (req, res) => {
  try {
    const { error, value } = employeeSchema.validate(req.params);
    if (error) res.status(404).json(error.details[0].message);
    const { tenantId, tripId, empId } = value;

    // Input validation
    if (!empId || !tenantId || !tripId) {
      return res.status(400).json({ error: "Invalid input parameters." });
    }

    // const tripId_ObjectId = new mongoose.Types.ObjectId(tripId);

    // Find the trip asynchronously
    const trip = await dashboard.findOne({
      tenantId,
      "tripSchema.tripId": tripId,
      "tripSchema.tripStatus": $in[("upcoming", "completed")],
      "travelRequestData.createdBy.empId": empId,
    });

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    const { travelRequestData } = trip.tripSchema;
    const { isCashAdvanceTaken } = travelRequestData;
    const updateStatus = (item) => {
      return item.status === "booked" ? "paid and cancelled" : "cancelled";
    };

    // Updating status for all itinerary types
    const updateItineraryType = (itineraryType) => {
      trip.tripSchema.travelRequestData.itinerary[itineraryType].forEach(
        (item) => {
          item.status = updateStatus(item);
        }
      );
    };

    // Update status for each itinerary type
    updateItineraryType("flights");
    updateItineraryType("hotels");
    updateItineraryType("cabs");
    updateItineraryType("buses");
    updateItineraryType("trains");

    // logic for cash advance
    if (trip.tripSchema.travelRequestData.isCashAdvanceTaken) {
      trip.tripSchema.cashAdvancesData.forEach((cashAdvance) => {
        cashAdvance.cashAdvanceStatus = updateStatus(cashAdvance);
      });
    }

    // Update trip status (upcoming/completed)
    trip.tripSchema.tripStatus = "paid and cancelled";

    // Update travel status
    trip.tripSchema.travelRequestData.travelRequestStatus =
      trip.tripSchema.travelRequestData.travelRequestStatus === "booked"
        ? "paid and cancelled"
        : "cancelled";

    // Save the updated trip asynchronously
    const tripCancelled = await trip.save();

    if (!tripCancelled) {
      return res
        .status(500)
        .json({
          error: "Internal Server Error - Trip cancellation failed",
          error,
        });
    } else {
      const travel = {
        travelRequestData: trip?.tripSchema.travelRequestData ?? {},
      };

      const cash = {
        travelRequestData: trip?.tripSchema.travelRequestData ?? {},
        cashAdvancesData: trip?.tripSchema.cashAdvancesData ?? [],
      };

      // To expense microservice
      await sendToOtherMicroservice(
        cash,
        "full-update",
        "expense",
        "to update travelRequestStatus and cashAdvances status in expense microservice- after cancellation of entire trip"
      );

      if (isCashAdvanceTaken) {
        //send to cash microservices
        console.log("rabbitmq cash", cash);
        //   await sendToDashboardMicroservice(cash, 'full-update-cash', 'trip cancelled at header level - update "cashSchema" in dashboard', 'trip', 'batch', 'true');
        await sendToOtherMicroservice(
          cash,
          "full-update",
          "cash",
          "to update travelRequestStatus and cashAdvances status in cash microservice- after cancellation of entire trip"
        );
        await sendToOtherMicroservice(
          cash,
          "full-update",
          "trip",
          "to update travelRequestStatus and cashAdvances status in cash microservice- after cancellation of entire trip"
        );
      } else {
        //send to travel microservices
        console.log("rabbitmq travel", travel);
        //   await sendToDashboardMicroservice(travel, 'full-update-travel', 'trip cancelled at header level - update "travelRequestSchema" in dashboard', 'trip', 'batch', 'true');
        await sendToOtherMicroservice(
          travel,
          "full-update",
          "travel",
          "to update entire travel request in Travel microservice- after cancellation of entire trip "
        );
        await sendToOtherMicroservice(
          travel,
          "full-update",
          "trip",
          "to update entire travel request in Travel microservice- after cancellation of entire trip "
        );
      }

      return res
        .status(200)
        .json({ message: "Trip cancelled successfully.", data: trip });
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error.message || "Internal server error.";
    return res.status(500).json({ error: errorMessage });
  }
};

// 3) Itinerary line item (Already booked line item) cancelled,  then update status from 'booked' to 'paid and cancelled'
//Line item cancellation is allowed for trips with = upcoming, transit status only
const updateStatus = (item) => {
  return item.status === "booked" ? "paid and cancelled" : "cancelled";
};

// Update status fields conditionally
//   export const itineraryLineItem = async (tripDetails, itineraryIds) => {
//       try{
//         const updateItemStatus = (items) => {
//           items.forEach(item => {
//             if (itineraryIds.includes(item.itineraryId.toString())) {   // .toString() is very important to make the code work.
//               item.status = updateStatus(item);
//             }
//           });
//         };

//         updateItemStatus(tripDetails.tripSchema.travelRequestData.itinerary.flights);
//         updateItemStatus(tripDetails.tripSchema.travelRequestData.itinerary.hotels);
//         updateItemStatus(tripDetails.tripSchema.travelRequestData.itinerary.cabs);
//         updateItemStatus(tripDetails.tripSchema.travelRequestData.itinerary.buses);

//         await tripDetails.save();

//         return tripDetails;
//       } catch(error){
//         console.error(error);
//         throw new Error(error)
//       }
//     };

// Line item cancel
export const cancelTripAtLineItemLevel = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;
    const { itineraryIds } = req.body;

    console.log("params", req.params);
    console.log(" itinerary ids", req.body);
    // Input validation
    if (
      !tenantId ||
      !tripId ||
      !empId ||
      !itineraryIds ||
      !Array.isArray(itineraryIds)
    ) {
      return res.status(400).json({ error: "Invalid input parameters." });
    }

    const tripDetails = await Trip.findOne({
      tenantId,
      tripId,
      $or: [
        { "travelRequestData.createdBy.empId": empId },
        { "travelRequestData.createdFor.empId": empId },
      ],
    });

    if (!tripDetails) {
      return res.status(404).json({ error: "Trip not found" });
    } else {
      const trip = await itineraryLineItem(tripDetails, itineraryIds);

      const travel = {
        travelRequestData: trip.travelRequestData ?? {},
      };

      const cash = {
        travelRequestData: trip?.travelRequestData ?? {},
        cashAdvancesData: trip?.cashAdvancesData ?? [],
      };
      const isCashAdvanceTaken = trip?.travelRequestData?.isCashAdvanceTaken;

      if (isCashAdvanceTaken) {
        console.log("Is cash advance taken:", isCashAdvanceTaken);
        //send to cash microservice
        await sendToOtherMicroservice(
          cash,
          "full-update",
          "cash",
          "to update entire travel and cashAdvances data in cash microservice- after cancellation of trip at itinerary level"
        );
        await sendToDashboardMicroservice(
          cash,
          "full-update-cash",
          'trip cancelled at line level - update "cashSchema" in dashboard',
          "trip",
          "batch",
          "true"
        );
      } else {
        //send to other microservices
        await sendToOtherMicroservice(
          travel,
          "full-update",
          "travel",
          "to update entire travel request in Travel microservice- after cancellation of trip at itinerary level"
        );
        await sendToDashboardMicroservice(
          travel,
          "full-update-travel",
          'trip cancelled at line item level - update "travelRequestSchema" in dashboard',
          "trip",
          "batch",
          "true"
        );
      }

      // send to expense microservice
      await sendToOtherMicroservice(
        cash,
        "full-update",
        "expense",
        "to update entire travel and cashAdvances data in expense microservice- after cancellation of trip at itinerary level"
      );

      return res
        .status(200)
        .json({ message: "Trip updated successfully", data: trip });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const travelAdmin = async (empId) => {
  try {
    // const verifiedEmployee = hrData.find((employee) => employee.empId === empId);
    const verifyEmployee = await HRMaster.findOne({
      employees: {
        $elemMatch: {
          "employeeDetails.employeeId": empId,
          "employeeRoles.finance": true,
        },
      },
    });

    // const verifiedEmployee = await HRMaster.findOne({
    //   'systemRelatedRoles.finance': {
    //     $elemMatch: {
    //       'employeeId': empId,
    //     }
    //   }
    // });

    // console.log('verifiedEmployee:', verifyEmployee);

    if (verifyEmployee) {
      const { finance } = verifyEmployee.systemRelatedRoles;

      const isValidFinance = finance.map((employee) => {
        if (employee.employeeId === empId) {
          return employee;
        }
      });

      // Assuming isValidFinance always has one object
      const verifiedEmployee = isValidFinance[0];

      // Check if a verified employee is found
      if (!verifiedEmployee) {
        // Throw an error if the employee is not associated with the finance role
        throw new Error("Employee is not a valid finance employee");
      }

      // Construct object with employeeName and employeeId
      const { employeeName, employeeId } = verifiedEmployee;

      console.log(
        `${empId} is a verified Travel Admin.`,
        verifiedEmployee,
        verifiedEmployee
      );
      return { empId: employeeId, name: employeeName };
    } else {
      console.log(`${empId} Employee is not a valid finance employee.`);
      return null;
    }
  } catch (error) {
    console.error("Error in travelAdmin:", error);
    throw error;
  }
};

const recoverItinerarySchema = Joi.array().items(
  Joi.object({
    itineraryId: Joi.string().length(24).required().messages({
      "string.base": `"itineraryId" should be a type of 'text'`,
      "string.empty": `"itineraryId" cannot be an empty field`,
      "string.length": `"itineraryId" should have a length of 24 characters`,
      "any.required": `"itineraryId" is a required field`,
    }),
    recoveredAmount: Joi.string().pattern(/^\d+$/).required().messages({
      "string.base": `"recoveredAmount" should be a type of 'text'`,
      "string.empty": `"recoveredAmount" cannot be an empty field`,
      "string.pattern.base": `"recoveredAmount" must be a number`,
      "any.required": `"recoveredAmount" is a required field`,
    }),
  })
);

// 3) Define updateRecoverStatus function
const updateRecoverStatus = (item) => {
  return item.status === "paid and cancelled" ? "recovered" : "cancelled";
};

// Update status fields conditionally
const itineraryLineItem = async (trip, recoverItinerary) => {
  const updateItemDetails = (items) => {
    items.forEach((item) => {
      // Find the corresponding itinerary detail
      const detail = recoverItinerary.find(
        (detail) => detail.itineraryId === item.itineraryId.toString()
      );

      if (detail) {
        // Update status and recovery amount if a matching itineraryId is found
        item.status = updateRecoverStatus(item);
        item.recoveredAmount = detail.recoveredAmount;
      }
    });
  };

  // Update all item types
  updateItemDetails(trip.tripSchema.travelRequestData.itinerary.flights);
  updateItemDetails(trip.tripSchema.travelRequestData.itinerary.hotels);
  updateItemDetails(trip.tripSchema.travelRequestData.itinerary.cabs);
  updateItemDetails(trip.tripSchema.travelRequestData.itinerary.buses);

  // Save changes
  await trip.save();

  return trip;
};

// Recover done for Line item
export const recoveryAtLineItemLevel = async (req, res) => {
  try {
    const { error: errorParams } = employeeSchema.validate(req.params);

    const { error: errorBody } = recoverItinerarySchema.validate(
      req.body.recoverItinerary
    );

    if (errorParams || errorBody) {
      return res.status(400).json({
        error: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const { tenantId, tripId, empId } = paramsValue;

    const { recoverItinerary } = bodyValue;
    const itineraryIds = recoverItinerary.map((item) => item.itineraryId);
    console.log("hiiii", req.params, itineraryIds);

    // Input validation
    if (
      !tenantId ||
      !tripId ||
      !empId ||
      !itineraryIds ||
      !Array.isArray(itineraryIds)
    ) {
      return res.status(400).json({ error: "Invalid input parameters." });
    }

    // Verify if the employee is a travel admin
    const verifiedTravelAdmin = await travelAdmin(empId);

    if (!verifiedTravelAdmin) {
      console.log(`Access denied. ${empId} is not a verified Travel Admin.`);
      return res.status(403).json({
        message: `Access denied. ${empId} is not a verified Travel Admin.`,
      });
    }

    const trip = await dashboard
      .findOneAndUpdate(
        {
          tenantId,
          tripId,
          tripStatus: { $in: ["upcoming", "transit", "completed"] },
          $or: [
            {
              "tripSchema.travelRequestData.itinerary.flights.status":
                "paid and cancelled",
            },
            {
              "tripSchema.travelRequestData.itinerary.hotels.status":
                "paid and cancelled",
            },
            {
              "tripSchema.travelRequestData.itinerary.cabs.status":
                "paid and cancelled",
            },
            {
              "tripSchema.travelRequestData.itinerary.buses.status":
                "paid and cancelled",
            },
            {
              "tripSchema.travelRequestData.itinerary.trains.status":
                "paid and cancelled",
            },
          ],
        },
        {
          $set: {
            "tripSchema.travelRequestData.recoveredBy": {
              empId: verifiedTravelAdmin.empId,
              name: verifiedTravelAdmin.name,
            },
          },
        },
        { new: true } // To return the updated document
      )
      .exec();

    // Check if the trip was found
    if (!trip) {
      console.log("No upcoming trip found for recovery.");
      return res
        .status(404)
        .json({ error: "No upcoming trip found for recovery." });
    }

    const lineItemStatusUpdate = await itineraryLineItem(
      trip,
      recoverItinerary
    );
    const { isCashAdvanceTaken } = trip?.tripSchema.travelRequestData;
    // Save the updated trip
    await trip.save();

    const data = "online";
    const needConfirmation = false;

    const travel = {
      travelRequestData: trip.tripSchema.travelRequestData ?? {},
    };

    const cash = {
      travelRequestData: trip?.tripSchema.travelRequestData ?? {},
      cashAdvancesData: trip?.tripSchema.cashAdvancesData ?? [],
    };

    await sendToOtherMicroservice(
      cash,
      "full-update",
      "expense",
      "to update entire travel and cashAdvances data in expense microservice-recovery after cancellation of trip at itinerary level"
    );

    if (isCashAdvanceTaken) {
      //send to cash microservice
      await sendToOtherMicroservice(
        cash,
        "full-update",
        "trip",
        "to update entire travel and cashAdvances data in cash microservice- recovery after cancellation of trip at itinerary level"
      );
      await sendToOtherMicroservice(
        cash,
        "full-update",
        "cash",
        "to update entire travel and cashAdvances data in cash microservice- recovery after cancellation of trip at itinerary level"
      );
    } else {
      //send to other microservices
      await sendToOtherMicroservice(
        travel,
        "full-update",
        "trip",
        "to update entire travel request in Travel microservice- recovery after cancellation of trip at itinerary level"
      );
      await sendToOtherMicroservice(
        travel,
        "full-update",
        "travel",
        "to update entire travel request in Travel microservice- recovery after cancellation of trip at itinerary level"
      );
    }

    // Send success response
    return res.status(200).json({
      message: `'Trip recovery at line item level successfully done by ${verifiedTravelAdmin.name}'`,
      trip,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
