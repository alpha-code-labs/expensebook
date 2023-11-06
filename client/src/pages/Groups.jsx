import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import { useLocation, useParams } from "react-router-dom";
import CreateGroup from "./groups/CreateGroup";
import CreatedGroups from "./groups/CreatedGroups";
import GroupsHome from "./groups/GroupsHome";
import SelectGroupHeaders from "./groups/SelectGroupHeaders";

export default function (props){
  
  const {state} = useLocation();
  console.log(state, '...state')
  const {tenantId} = useParams() 
  console.log(tenantId)


  const [groupData, setGroupData] = useState([])

  return <>

     {tenantId &&
      <Routes>
        <Route path={'/'} element={<GroupsHome setGroupData={setGroupData} />} />
        <Route path={`/select-grouping-headers`} element={<SelectGroupHeaders />} />
        <Route path='/create-groups' 
            element={<CreateGroup 
                groupData={groupData} 
                setGroupData={setGroupData} />} />
        <Route path="/created-groups" 
            element={<CreatedGroups 
                groupData={groupData}
                setGroupData={setGroupData} />} />

      </Routes>}
  </>;
}
