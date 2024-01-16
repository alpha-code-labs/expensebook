import axios from "axios";
import { updateStart, updateSuccess, updateFailure } from "./updateRedux";
export const updateSettlementColumn = async (dispatch, id) => {
  console.log(id);
  dispatch(updateStart());
  const data = { _id: id };

  try {
    const res = await axios.put(
      "http://localhost:3000/api/cashAdvance/settlement",
      data
    );
    console.log(res.data);
    dispatch(updateSuccess(res.data));
  } catch (error) {
    console.log(error);
    dispatch(updateFailure());
  }
};

export const notUpdateSettlementColumn = async (dispatch , id) => {
  const data = { _id: id };
  console.log("LINE AT 68", data);
  dispatch(updateStart());

  try {
const res =    await axios.put("http://localhost:3000/api/cashAdvance/unSettlement", data);
    dispatch(updateSuccess(res.data));

} catch (error) {
    dispatch(updateFailure());
    
    console.log(error);
  }
};
