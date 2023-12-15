import mongoose from 'mongoose'

const travelRequestStatusEnums = [
'draft',
'pending approval',
'approved',
'rejected',
'pending booking',
'booked',
'transit',
'cancelled',
]

const travelRequestStateEnums = [
'section 0',
'section 1',
'section 2',
'section 3',
]

const approverStatusEnums = [
'pending approval',
'approved',
'rejected',
];

const itineraryStatusEnums = [
'draft',
'pending approval',
'approved',
'rejected',
'pending booking',
'booked',
'cancelled',
'paid and cancelled',
'intransit',
'upcoming',
];

const transferEnums = [
'regular',
'departure pickup',
'departure drop',
'return pickup',
'return drop',
]

const itinerarySchema = (
{
formState:[{
formId:String,
transfers:{
needsDeparturePickup:Boolean,
needsDepartureDrop:Boolean,
needsReturnPickup:Boolean,
needsReturnDrop:Boolean,
},
needsHotel:Boolean,
needsCab:Boolean,
needsVisa:Boolean,
modeOfTransit:String,
travelClass:String,
}],

flights:[{
itineraryId: mongoose.Schema.ObjectId,
formId:String,
from: String,
to: String,
date: String,
time: String,
travelClass:String,
violations:{
class: String,
amount: String,
},
bkd_from: String,
bkd_to: String,
bkd_date: String,
bkd_time: String,
bkd_travelClass:String,
bkd_violations:{
class: String,
amount: String,
},
modified: Boolean,
cancellationDate: Date,
cancellationReason: String,
status:{type:String, enum:itineraryStatusEnums},
bookingDetails:{
docURL: String,
docType: String,
billDetails: {},
isReturnTravel:Boolean,
}
}],

buses:[{
itineraryId: mongoose.Schema.ObjectId,
formId:String,
from: String,
to: String,
date: String,
time: String,
travelClass:String,
violations:{
class: String,
amount: String,
},
bkd_from: String,
bkd_to: String,
bkd_date: String,
bkd_time: String,
bkd_travelClass:String,
modified: Boolean,
cancellationDate: Date,
cancellationReason: String,
status:{type:String, enum:itineraryStatusEnums},
bookingDetails:{
docURL: String,
docType: String,
billDetails: {},
isReturnTravel: Boolean
}
}],

trains:[{
itineraryId: mongoose.Schema.ObjectId,
formId:String,
from: String,
to: String,
date: String,
time: String,
travelClass:String,
violations:{
class: String,
amount: String,
},
bkd_from: String,
bkd_to: String,
bkd_date: String,
bkd_time: String,
bkd_travelClass:String,
bkd_violations:{
class: String,
amount: String,
},
modified: Boolean,
cancellationDate: Date,
cancellationReason: String,
status:{type:String, enum:itineraryStatusEnums},
bookingDetails:{
docURL: String,
docType: String,
billDetails: {},
isReturnTravel: Boolean
}
}],

hotels:[{
itineraryId: mongoose.Schema.ObjectId,
formId:String,
location:String,
locationPreference:String,
class:String,
checkIn:String,
checkOut:String,
checkInTime:String,
checkOutTime:String,
violations:{
class: String,
amount: String,
},
bkd_location:String,
bkd_class:String,
bkd_checkIn:String,
bkd_checkOut:String,
bkd_checkInTime:String,
bkd_checkOutTime:String,
bkd_violations:{
class: String,
amount: String,
},
modified:Boolean,
cancellationDate:String,
cancellationReason:String,
status:{type:String, enum:itineraryStatusEnums},
bookingDetails:{
docURL: String,
docType: String,
billDetails: {},
}
}],

cabs:[{
itineraryId: mongoose.Schema.ObjectId,
formId:String,
date:String,
class:String,
preferredTime:String,
pickupAddress:String,
dropAddress:String,
violations:{
class: String,
amount: String,
},
bkd_date:String,
bkd_class:String,
bkd_preferredTime:String,
bkd_pickupAddress:String,
bkd_dropAddress:String,
bkd_violations:{
class: String,
amount: String,
},
modified:Boolean,
cancellationDate:String,
cancellationReason:String,
status:{type:String, enum:itineraryStatusEnums},
bookingDetails:{
docURL: String,
docType: String,
billDetails: {},
},
type:{
type:String,
enum:transferEnums,
}
}],
}
)

export const travelRequestSchema = new mongoose.Schema({
tenantId: {
type: String,
required: true,
},
tenantName:{
type: String,
},
companyName:{
type: String,
},
travelRequestId: {
type: String, // tenantId_createdBy_tr_#(tr number) | tentative | not fixed
required: true,
unique: true,
},
tripPurpose: {
type: String,
required: true,
},
travelRequestStatus: { //initialize with status as 'draft'
type: String,
enum: travelRequestStatusEnums,
default: 'draft',
required: true,
},
travelRequestState: { //initialize with state as 'section 0'
type: String,
enum: travelRequestStateEnums,
default: 'section 0',
required: true,
},
createdBy:{
type: {empId: String, name: String}, //employee Id by whom TR is raised
required: true
},
createdFor: {
type: {empId: String, name: String}, //employee Id for whom TR is raised
required: false
},
teamMembers: [],
travelAllocationHeaders: [],
itinerary: itinerarySchema,
tripType:{oneWayTrip:Boolean, roundTrip:Boolean, multiCityTrip:Boolean},
travelDocuments: [String],
bookings: [
{
itineraryReference:{},
docURL:String,
details:{},
status:{},
},
],
approvers: [{
empId: String,
name: String,
status: {
type: String,
enum: approverStatusEnums,
},
},],

preferences: [String],
travelViolations: {},
travelRequestDate: {
type: String,
required:true
},
travelBookingDate: String,
travelCompletionDate: String,
travelRequestRejectionReason: String,
isCancelled:Boolean,
cancellationDate:String,
cancellationReason:String,
isCashAdvanceTaken: String,
sentToTrip:Boolean,
})

travelRequestSchema.pre('save', async function (next) {
// Generate a new ObjectId and set it for each section if not already there

if (!this.travelRequestId) {
  // Fetch the company name (assuming it is available in the schema)
  const companyName = this.companyName;

  // Count the number of existing travel requests for the company
  const count = await TravelRequest.countDocuments({
    companyName: companyName,
  });

  // Generate the six-digit number with leading zeros
  const sixDigitNumber = count.toString().padStart(6, '0');

  // Create the travelRequestId using the specified format
  this.travelRequestId = `TR${companyName.substring(0, 2)}${sixDigitNumber}`;
}

this.itinerary.flights.forEach(flight=>{
  if(!flight.itineraryId) flight.itineraryId = new mongoose.Types.ObjectId()
})

this.itinerary.trains.forEach(train=>{
  if(!train.itineraryId) train.itineraryId = new mongoose.Types.ObjectId()
})

this.itinerary.buses.forEach(bus=>{
  if(!bus.itineraryId) bus.itineraryId = new mongoose.Types.ObjectId()
})

this.itinerary.hotels.forEach(hotel=>{
  if(!hotel.itineraryId) hotel.itineraryId = new mongoose.Types.ObjectId()
})

this.itinerary.cabs.forEach(cab=>{
  if(!cab.itineraryId) cab.itineraryId = new mongoose.Types.ObjectId()
})

// Continue with the save operation
next();
});

travelRequestSchema.pre('validate', function (next){
if (!travelRequestStatusEnums.includes(this.travelRequestStatus)) {
// If status is not in the enum, throw a validation error
next(new Error('Invalid travel request status'));
} else {
// Continue with the validation
next();
}
})

travelRequestSchema.pre('validate', function (next){
if (!travelRequestStateEnums.includes(this.travelRequestState)) {
// If status is not in the enum, throw a validation error
next(new Error('Invalid travel request state'));
} else {
// Continue with the validation
next();
}
})

const TravelRequest = mongoose.model('travel_request_container', travelRequestSchema)
export default TravelRequest