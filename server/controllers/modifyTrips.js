import Joi from "joi"
import Trip from "../models/tripSchema.js"
import { fetchOnboardingData } from "../services/hrData.js"
import { addALeg } from "./addALeg.js"
import { itineraryLineItem } from "./cancelTripController.js"


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


export const modifyTrip = async(req,res) => {
    try{    
        const { error: errorParams, value: valueParams} = employeeSchema.validate(req.params)
        if(errorParams) return res.status(400).send(errorParams.details[0].message)
        const {error: errorBody, value: valueBody} = bodySchema.validate(req.body)
        if(errorBody) return res.status(400).send(errorBody.details[0].message)
        
        const { tenantId, empId, tripId} = valueParams
        const {cancelIds=[] , modifyIds=[], newItinerary={}, allocations=[]} = valueBody

        const isValidItinerary = Object.values(newItinerary)
        .filter(Array.isArray)
        .some(array => array?.length > 0)

        const isModifyIds = Array.isArray(modifyIds)?.length
        console.log("here", tenantId, empId, tripId)
        console.log("cancelIds", JSON.stringify(cancelIds, '' , 2) ,
        "newItinerary",JSON.stringify(newItinerary, '' , 2),
        "allocations", JSON.stringify(allocations, '' , 2) )

        const tripDetails = await  getTrip(tenantId,empId,tripId)

        if(tripDetails){

        if(cancelIds){
            const cancelItinerary = await itineraryLineItem(tripDetails, cancelIds);
            console.log("cancelItinerary 0 flightzzzz", JSON.stringify(cancelItinerary.travelRequestData.itinerary.flights, " ", 2))
        } 

        if(isValidItinerary && isModifyIds){
            const modifyTrip = await addALeg(tripDetails,newItinerary,allocations)
            await itineraryLineItem(tripDetails, modifyIds);
            console.log("addALeg maga", modifyTrip)
        }

        return res.status(200).json({success:true , tripDetails})
        } else {
            return res.status(400).json({success:false, message:"Invalid request:"})
        }

    } catch(error){
        console.error(error)
        return res.status(500).json({success:false, error})
    }
}










