import axios from "axios";
import { updateStart, updateSuccess, updateFailure } from "./updateRedux";
// import { fetchDummyStart , fetchDummySuccess , fetchDummyFailure } from "./dummyDataRedux";

// export const getdummyCashAdvanceData = async (dispatch , path) => {
//   console.log(path);
//   dispatch(fetchDummyStart());
//   try {
//     const res = await axios.get(
//       `http://localhost:3000/api/${path}/find`
//     );
//     dispatch(fetchDummySuccess(res.data));
//     // setDummyValues(data.data);
//   } catch (error) {
//     dispatch(fetchDummyFailure());
//     console.log(error);
//   }
// };

export const updateSettlementColumn = async (dispatch, id , path) => {
  // console.log(path);
  dispatch(updateStart());
  const data = { _id: id };

  try {
    const res = await axios.put(
      `http://localhost:3000/api/${path}/settlement`,
      data
    );
    // console.log(res.data);
    dispatch(updateSuccess(res.data));
  } catch (error) {
    console.log(error);
    dispatch(updateFailure());
  }
};

export const notUpdateSettlementColumn = async (dispatch , id , path) => {
  const data = { _id: id };
  console.log("LINE AT 68", data);
  dispatch(updateStart());

  try {
const res =    await axios.put(`http://localhost:3000/api/${path}/unSettlement`, data);
    dispatch(updateSuccess(res.data));

} catch (error) {
    dispatch(updateFailure());
    
    console.log(error);
  }
};
