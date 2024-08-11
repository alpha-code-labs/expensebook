
const tripHeaders= [
    "start date",
    "completion date",
    "trip number",
    "travel type",
    "trip status",
    "created by",
    "approver",
    "trip purpose",
]


const travelExpenseHeaders = [
  "trip number",
  "trip status",
  "travel type",
  "expense number",
  "expense date",
  "expense amount",
  "created by",
  "expense status",
  "payment mode",
  "paid by",
  "included bills"
]

const cashAdvanceHeaders = [
  "travel request number",
  "travel request status",
  "travel type",
  "cash-advance number",
  "requested date",
  // "amount",
  "created by",
  "cash-advance status",
  "payment mode",
  "paid by",
  
]

const reimbursementHeaders=[

  "reimbursement number",
  "requested date",
  "category",
  "created by",
  "expense amount",
  "created by",
  "expense status",
  "payment mode",
  "paid by",
  "merchant"

]


export  {reimbursementHeaders, cashAdvanceHeaders, travelExpenseHeaders, tripHeaders}