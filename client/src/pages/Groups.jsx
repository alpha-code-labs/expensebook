import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import { useLocation, useParams } from "react-router-dom";
import CreateGroup from "./groups/CreateGroup";
import CreatedGroups from "./groups/CreatedGroups";
import GroupsHome from "./groups/GroupsHome";
import SelectGroupHeaders from "./groups/SelectGroupHeaders";

export default function ({progress, setProgress}){
  
  const {state} = useLocation();
  console.log(state, '...state')
  const {tenantId} = useParams() 
  console.log(tenantId)


  const [groupData, setGroupData] = useState([])

  useEffect(()=>{
    if(progress!= undefined && progress?.activeSection != 'section 4'){
      setProgress(pre=>({...pre, activeSection: 'section 4'}))
    }
  },[progress])

  return <>

     {tenantId &&
      <Routes>
        <Route path={'/'} element={<GroupsHome setGroupData={setGroupData} progress={progress} setProgress={setProgress} />} />
        <Route path={`/select-grouping-headers`} element={<SelectGroupHeaders progress={progress} setProgress={setProgress} />} />
        <Route path='/create-groups' 
            element={<CreateGroup 
                progress={progress} 
                setProgress={setProgress}
                groupData={groupData} 
                setGroupData={setGroupData} />} />
        <Route path="/created-groups" 
            element={<CreatedGroups 
                progress={progress} 
                setProgress={setProgress}
                groupData={groupData}
                setGroupData={setGroupData} />} />

      </Routes>}
  </>;
}
