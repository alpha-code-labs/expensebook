import nonTravelExpense from '../dummyData/nonTravelExpense';

const getNonTravelExpense= async (req, res) => {
  try{
   await  res.status(200).json(nonTravelExpense);}
   catch(error){
    console.error({error: "Internal Server Error"})
  };}

export default getNonTravelExpense;
