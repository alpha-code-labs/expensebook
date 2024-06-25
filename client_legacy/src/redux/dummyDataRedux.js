import { createSlice } from "@reduxjs/toolkit";

const dummyDataSlice = createSlice({
    name:"dummyData" , 
    initialState:{
        isFetching:false , 
        currentData:null , 
        isError:false , 
    } , 
    reducers:{
        fetchDummyStart:(state)=>{
            state.isFetching = true ;
            state.isError= false;
        } , 
        fetchDummySuccess:(state,action) =>{
            state.isFetching = false;
            state.currentData = action.payload;
        } , 
        fetchDummyFailure:(state)=>{
            state.isFetching = false ;
            state.isError= true;
        }
    }
}) ;

export const {fetchDummyStart , fetchDummySuccess , fetchDummyFailure} = dummyDataSlice.actions;
export default dummyDataSlice.reducer;