import { createSlice } from "@reduxjs/toolkit";

const updateSlice = createSlice({
    name: "update",
    initialState:{
        isFetching:false , 
        update:null , 
        isError:false ,
    }, 
    reducers:{
        updateStart:(state)=>{
            state.isFetching = true ;
            state.isError = false;
        } , 
        updateSuccess:(state , action)=>{
            state.isFetching = false ;
            state.update = action.payload;
        } ,
        updateFailure:(state)=>{
            state.isFetching = false ;
            state.isError = true;
        } ,
    }
});

export const {updateStart , updateSuccess , updateFailure} = updateSlice.actions;
export default updateSlice.reducer;