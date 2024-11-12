
export {categoryClasses, disableDeleteLine,disableEditLine,totalAmountKeys, dateKeys, isClassField, invoiceNoKeys}
const totalAmountKeys = ['Total Fare','Total Amount',  'Subscription Cost', 'Cost', 'Premium Cost'];
const dateKeys = ['Invoice Date', 'Date', 'Visited Date', 'Booking Date',"Bill Date"];
const invoiceNoKeys = [ 'Booking Reference Number','Bill Number'];
const isClassField = ['Class', 'Class of Service']
//line item button retrictions
const disableEditLine = ['paid','approved']
const disableDeleteLine = ['paid',]


const categoryClasses = {
    "Flight": [
        "Economy",
        "Premium Economy",
        "Business",
        "First Class"
    ],
    "Train":[
        "First AC ",
        "Second AC",
        "Third AC",
        "Sleeper",
        "Chair Car"
    ],
    "Bus":[
        "Sleeper",
        "Semi-Sleeper",
        "Regular"
    ],
    "Cab":
    [
        "Economy",
        "Business",
        "Executive"
    ],
    "Hotel":
    [
        "Motel",
        "3 star",
        "4 star",
        "5 star"
    ]
}
