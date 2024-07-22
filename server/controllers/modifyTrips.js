import Joi from "joi"
import HRMaster from "../models/hrCompanySchema.js"
import Trip from "../models/tripSchema.js"
import { fetchOnboardingData } from "../services/hrData.js"
import { addALeg } from "./addALeg.js"
import { itineraryLineItem } from "./cancelTripController.js"


export async function getHrData(req,res) {
    try{
 const { tenantId, empId, travelType} = req.params

    const report = await fetchOnboardingData(tenantId,empId)

    if(report){
        return res.status(200).json(report)
    }

    } catch(error){
     console.error(error)
     return res.status(500).json({message: 'internal server error'})
    }
}

export const employeeSchema = Joi.object({
    tenantId: Joi.string().required(),
    empId:Joi.string().required(),
    tripId:Joi.string().required()
});

const itineraryItemSchema = Joi.object({
    bkd_date: Joi.date(),
    itineraryId: Joi.string().required()
  });

  const itinerarySchema = Joi.object({
    flights: Joi.array().items(itineraryItemSchema),
    hotels: Joi.array().items(itineraryItemSchema),
    cabs: Joi.array().items(itineraryItemSchema),
    buses: Joi.array().items(itineraryItemSchema),
    trains: Joi.array().items(itineraryItemSchema)
  });

const bodySchema = Joi.object({
    cancelIds: Joi.array().items(Joi.string()),
    itinerary: itinerarySchema.min(1)
  }).or('cancelIds', 'itinerary');

export const modifyTrip = async(req,res) => {
    try{    
        const { error: errorParams, value: valueParams} = employeeSchema.validate(req.params)
        if(errorParams) return res.status(400).send(errorParams.details[0].message)
        const {error: errorBody, value: valueBody} = bodySchema.validate(req.body)
        if(errorValue) return res.status(400).send(errorBody.details[0].message)
        
        const { tenantId, empId, tripId} = valueParams
        const {cancelIds , itinerary} = valueBody

        let action;
        if(cancelIds){
            action = 'cancelIds'
        } else if(itinerary){
            action = 'itinerary'
        } 

        const getTrip = Trip.findOne({
            tripId,
            tenantId,
            'travelRequestData.createdBy.empId':empId
        })

        if(getTrip){
        switch (action){
            case 'cancelIds':
                    const cancelItinerary = await itineraryLineItem(getTrip, cancelIds);
                    console.log("cancelItinerary", cancelItinerary)
                
            break;
            case 'itinerary':
                  const modifyTrip = await addALeg(tenantId,empId,tripId,itinerary)
                  console.log("modifyTrip", modifyTrip)
            break;
        }
        }

    } catch(error){
        console.error(error)
    }
}




