import Joi from "joi"
import Trip from "../models/tripSchema.js"
import { fetchOnboardingData } from "../services/hrData.js"
import { addALeg } from "./addALeg.js"
import { itineraryLineItem } from "./cancelTripController.js"
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js"


export async function getHrData(req,res) {
    try{
const { tenantId, empId, travelType} = req.params

    const report = await fetchOnboardingData(tenantId,empId,travelType)

    if(report){
        return res.status(200).json(report)
    }

    } catch(error){
     console.error(error)
     return res.status(500).json({message: 'internal server error'})
    }
}

export async function getTrip(tenantId,empId,tripId){
    try{
        const getTripDetails =  await Trip.findOne({
            tenantId,
            "tripStatus": { $in: ['transit', 'upcoming'] },
            "tripId": tripId,
            $or: [
              { 'travelRequestData.createdBy.empId': empId},
              { 'travelRequestData.createdFor.empId': empId},
            ],
          });

          if(getTripDetails){
            return getTripDetails
          } else {
            throw new Error('Invalid query:Trip Not Found')
          }
    } catch (error){
        console.log(error)
        throw error
    }
}

export const employeeSchema = Joi.object({
    tenantId: Joi.string().required(),
    empId:Joi.string().required(),
    tripId:Joi.string().required()
});

const itineraryItemSchema = Joi.object({
});

const itinerarySchema = Joi.object({
    newFlights: Joi.array(),
    newHotels: Joi.array(),
    newCabs: Joi.array(),
    newBuses: Joi.array(),
    newTrains: Joi.array(),
    newCarRentals: Joi.array(),
    newPersonalVehicles: Joi.array()
});

const bodySchema = Joi.object({
    cancelIds: Joi.array().items(Joi.string()),
    modifyIds: Joi.array().items(Joi.string()),
    newItinerary: itinerarySchema.min(1),
    allocations: Joi.array()
}).or('cancelIds','allocations','modifyIds','newItinerary')

const updateItinerary = async (tripDetails, newItinerary, allocations, modifyIds) => {

  try {
    const promises = [
      itineraryLineItem(tripDetails, modifyIds, 'booked'),
      addALeg(tripDetails, newItinerary, allocations),
    ];

    const [modifyTrip] = await Promise.all(promises);

    console.log("addALeg result:", modifyTrip);
  } catch (error) {
    console.error('Error updating itinerary:', error.message);
    throw new Error
    //implement rollback logic here if necessary
  }
};


export const modifyTrip = async(req,res) => {
    try{    
        const { error: errorParams, value: valueParams} = employeeSchema.validate(req.params)
        if(errorParams) return res.status(400).json(errorParams.details[0].message)
        const {error: errorBody, value: valueBody} = bodySchema.validate(req.body)
        if(errorBody) return res.status(400).send(errorBody.details[0].message)
        
        const { tenantId, empId, tripId} = valueParams
        const {cancelIds=[] , modifyIds=[], newItinerary={}, allocations=[]} = valueBody

        console.log("cancelIds=[] , modifyIds=[], newItinerary={}, allocations=[]", cancelIds, modifyIds, newItinerary, allocations)
        const isValidItinerary = Object.values(newItinerary)
        .filter(Array.isArray)
        .some(array => array?.length > 0)

        console.group("begining")
       const isModifyIds = modifyIds.length > 0 ? true : false;
        console.log("here", tenantId, empId, tripId)
        console.log("isModifyIds",isModifyIds)
        console.log("cancelIds", JSON.stringify(cancelIds, null, 2) ,
        "newItinerary",JSON.stringify(newItinerary, null, 2),
        "allocations", JSON.stringify(allocations, null , 2) )
        console.groupEnd()

        const tripDetails = await getTrip(tenantId,empId,tripId)

        if(tripDetails){
        
        if(cancelIds){
            const cancelItinerary = await itineraryLineItem(tripDetails, cancelIds,'cancelled');
            console.log("cancelItinerary 0 flightzzzz", JSON.stringify(cancelItinerary.travelRequestData.itinerary.flights, " ", 2))
        } 

        if (isValidItinerary && isModifyIds) {
            try {
                const success = await itineraryLineItem(tripDetails, modifyIds, 'booked');
                if (success) {
                  const addItinerary = await addALeg(tripDetails, newItinerary, allocations);
                  if (addItinerary.success) {
                    // console.log(addItinerary.message); 
                    // const modifyTrip = addItinerary.modifyTrip; 
                  
                } else {
                  console.warn("Add itinerary and delete already booked itinerary failed:", addItinerary.message);

                    throw new Error("Duplicate entry");
                }
                } else {
              console.warn("Modify itinerary failed:", success.message);
            }} catch (error) {
                console.error(error);
                throw new Error("Duplicate entry");
            }
        }

        if (isValidItinerary && !isModifyIds) {
          try {
              const addItinerary = await addALeg(tripDetails, newItinerary, allocations);
              if (addItinerary.success) {
                  // console.log(addItinerary.message); 
                  // const modifyTrip = addItinerary.modifyTrip; 
                
              } else {
                  console.warn("Add itinerary failed:", addItinerary.message);
              }
          } catch (error) {
              console.error("Error occurred while adding itinerary:", error);
              throw new Error("Duplicate entry"); // Re-throw a custom error
          }
      }

        const getDoc = await getTrip(tenantId,empId,tripId)
        const {travelRequestData} =getDoc
        const { approvers, isCashAdvanceTaken} =travelRequestData
        const isTransit = getDoc.tripStatus ==='transit'
        if (approvers && approvers?.length > 0 && !isTransit) {
          console.log("Approvers found for this trip:", approvers);
          await sendToOtherMicroservice(travelRequestData, 'add-leg', 'approval', 'to update itinerary added to travelRequestData for trips');
        }
        
        if (isCashAdvanceTaken) {
          console.log('Is cash advance taken:', isCashAdvanceTaken);
          await sendToOtherMicroservice(travelRequestData, 'add-leg', 'cash', 'to update itinerary added to travelRequestData for trips');
          await sendToOtherMicroservice(travelRequestData, 'add-leg', 'dashboard', 'to update itinerary added to travelRequestData for trips');
        } else {
          await sendToOtherMicroservice(travelRequestData, 'add-leg', 'travel', 'to update itinerary added to travelRequestData for trips');
          await sendToOtherMicroservice(travelRequestData, 'add-leg', 'dashboard', 'to update itinerary added to travelRequestData for trips');
        } 

        return res.status(200).json({success:true ,message:"Trip Updated Successfully", tripDetails})
        } else {
            return res.status(400).json({success:false, message:"Invalid request:"})
        }

    } catch(error){
        console.error(error)
        return res.status(500).json({success:false, error:error.message})
    }
}










