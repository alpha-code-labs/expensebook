// Layout.js

import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../components/common/Icon';
import LeftProgressBar from '../components/common/LeftProgressBar';
import { getProgress_API } from '../utils/api';

const Layout = ({ children, progress, setProgress}) => {
  const location = useLocation();
  
  const tenantId = location.pathname.split('/')[1];
  console.log(location.pathname.split('/')[1], 'tenantId from layout')

  const showLeftNav = ![`/${tenantId}/welcome`].includes(location.pathname);
  const initialState = {
    maxReach: 'Section 1',
    activeSection: 'Section 1',
    activeSubSection: null,

    sections:{
      'section 1': {
          navigationUri: '/company-info',
          title: 'HR Information',
          state: 'not attempted', 
          lastModified:'4/12/2024', 
          totalSubsections:1, 
          coveredSubsections:0,
          subsections:[{name: 'HR Information', completed:false, navigationUri: '/company-info',}],
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
        state: 'done',
        lastModified: undefined,
        totalSubsections: 3,
        coveredSubsections: 0,
        subsections:[
            {name: 'Select Filters', completed:false, navigationUri: '/grouops/select-grouping-headers'},
            {name: 'Create Groups', completed: true, navigationUri: '/groups/create-groups'},
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
            {name: 'Local Policies', completed:false, navigationUri: '/setup-company-policies/international'},
            {name: 'Reimbrusement Policies', completed:false, navigationUri: '/setup-policies/non-travel'}
        ],
      },

      'section 6': {
        navigationUri: '/others',
        title: 'Other Setups',
        state: 'not attempted',
        lastModified: undefined,
        totalSubsections: 4,
        coveredSubsections: 2,
        subsections:[
            {name: 'Currency Table', completed:false, navigationUri: '/others/multicurrency'},
            {name: 'Roles Setup', completed: false, navigationUri: '/others/roles'},
            {name: 'Cash Advance Settlement Optioins', completed:false, navigationUri: '/others/cash-advance-settlement-options'},
            {name: 'Expense Settlement Options', completed:false, navigationUri: '/others/expense-settlement-options'},
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

  useEffect(()=>{
    //later on do a fetch to get initial state from server..
      (async function(){
        const res = await getProgress_API({tenantId});
        
        if(Object.keys(res.data).length == 0){
            setProgress(initialState);
        }else{
            setProgress(res.data.progress)
        }
      })()
      
  },[])


  return (
    <div>
      {showLeftNav && (
       <>
        <Icon/>
        <LeftProgressBar 
            progress={progress} 
            setProgress={setProgress}
            />
       </>
      )}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
