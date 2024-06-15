// Layout.js

import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/common/Icon';
import LeftProgressBar from '../components/common/LeftProgressBar';
import { getProgress_API,  } from '../utils/api';
import Error from '../components/common/Error';

const Layout = ({ children, progress, setProgress, companyName, onboarder}) => {
  const location = useLocation();
  
  const tenantId = useMemo(()=>location.pathname.split('/')[1], []);
  const navigate = useNavigate();

  console.log(location.pathname.split('/'))
  console.log(location.pathname.split('/')[1], 'tenantId from layout')

  const showLeftNav = ![`/${tenantId}/welcome`, `/${tenantId}/welcome/`].includes(location.pathname);
  const initialState = {
    maxReach: 'Section 1',
    activeSection: 'Section 1',
    activeSubSection: null,

    sections:{
      'section 1': {
          navigationUri: '/company-info',
          title: 'Company Information',
          state: 'not attempted', 
          lastModified:'4/12/2024', 
          totalSubsections:1, 
          coveredSubsections:0,
          subsections:[{name: 'Company Information', completed:false, navigationUri: '/company-info',}],
      },

      'section 2': {
        navigationUri: '/upload-hr-data',
        title: 'Upload HR Data',
        state: 'not attempted',
        lastModified: undefined,
        totalSubsections: 1,
        coveredSubsections: 0,
        subsections:[{name: 'Upload HR Data', completed:false, navigationUri: '/upload-hr-data'}],
      },

      'section 3': {
        navigationUri: '/setup-expensebook',
        title: 'Setup Expensebook',
        state: 'not attempted',
        lastModified: undefined,
        totalSubsections: 2,
        coveredSubsections: 0,
        subsections:[
            {name: 'Travel Allocations', completed:false, navigationUri: '/setup-expensebook/travel'},
            {name: 'Reimbursement Allocations', completed: false, navigationUri: '/setup-expensebook/reimbursement'}
        ],
      },

      'section 4': {
        navigationUri: '/groups',
        title: 'Setup Groups',
        state: 'not attempted',
        lastModified: undefined,
        totalSubsections: 3,
        coveredSubsections: 0,
        subsections:[
            {name: 'Select Filters', completed:false, navigationUri: '/grouops/select-grouping-headers'},
            {name: 'Create Groups', completed: false, navigationUri: '/groups/create-groups'},
            {name: 'Created Groups', completed: false, navigationUri: '/groups/created-groups'},
        ],
      },

      'section 5': {
        navigationUri: '/setup-company-policies',
        title: 'Setup Policies',
        state: 'not attempted',
        lastModified: undefined,
        totalSubsections: 4,
        coveredSubsections: 0,
        subsections:[
            {name: 'International Policies', completed:false, navigationUri: '/setup-company-policies/international'},
            {name: 'Domestic Policies', completed:false, navigationUri: '/setup-company-policies/domestic'},
            {name: 'Local Policies', completed:false, navigationUri: '/setup-company-policies/local'},
            {name: 'Reimbursement Policies', completed:false, navigationUri: '/setup-company-policies/reimbursement'}
        ],
      },

      'section 6': {
        navigationUri: '/others',
        title: 'Other Setups',
        state: 'not attempted',
        lastModified: undefined,
        totalSubsections: 4,
        coveredSubsections: 0,
        subsections:[
            {name: 'Currency Table', completed:false, navigationUri: '/others/multicurrency'},
            {name: 'Roles Setup', completed: false, navigationUri: '/others/roles'},
            {name: 'Cash Advance Settlement Optioins', completed:false, navigationUri: '/others/cash-advance-settlement-options'},
            {name: 'Expense Settlement Options', completed:false, navigationUri: '/others/cash-expense-settlement-options'},
        ],
      },
      
      ['Onboarding Completed']: {
        navigationUri: null,
        state: 'not attempted',
        lastModified: undefined,
        totalSubsections: 0,
        coveredSubsections: 0,
        subsections:[{name: 'Onboarding Completed', completed:false}],
      },

    }	
  }

  const [isLoading, setIsLoading] = useState(false);
  const [loadingErrMsg, setLoadingErrMsg] = useState(null);

  useEffect(()=>{
    //fetch initial state from server..
      (async function(){
        setIsLoading(true);
        const res = await getProgress_API({tenantId});
        
        if(res.err){
          setLoadingErrMsg(res.err);
          return;
        }

        if(Object.keys(res?.data)?.length == 0){
            setProgress(initialState);
            if(location.pathname.split('/')[2] != undefined && location.pathname.split('/')[2] == '' ){
              navigate(`/${tenantId}${progress.sections[progress.activeSection].subsections[0].navigationUri}`)
            }
        }else{
            setProgress(res.data.progress)
            console.log('executed')
            if(location.pathname.split('/')[2] != undefined && location.pathname.split('/')[2] == 'welcome'){
             // navigate(`/${tenantId}${res.data.progress.sections[res.data.progress.activeSection].subsections[0].navigationUri}`)
            }
        }
        setIsLoading(false);
      })()
      
  },[])

  return (
    <>
    {<div>
      {showLeftNav && (
       <>
        <Icon/>
        <LeftProgressBar 
            tenantId={tenantId}
            progress={progress} 
            setProgress={setProgress}
            />
       </>
      )}
      <div className="main-content">
        {children}
      </div>
    </div>}
    </>
  );
};

export default Layout;
