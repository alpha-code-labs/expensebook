// Page.js

import React, { useEffect, useState } from 'react';
import { getTripDataApi as tripFetchApi  } from '../utils/tripApi';

const Page = () => {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingErrMsg, setLoadingErrMsg] = useState(null);

  const routeData = {
    tenantId: 'tenantId_xyz0001',
    tripId: 'tripId_abc6548',
    empId: 'empId_77666t'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await tripFetchApi(routeData.tripId, routeData.tenantId, routeData.empId);

        if (error) {
          setLoadingErrMsg(`Error (${error.status}): ${error.message}`);
        } else {
          setTripData(data);
        }

        setLoading(false);
      } catch (error) {
        setLoadingErrMsg(`Error fetching trip data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading && (
        <div className='min-w-screen min-h-screen flex justify-center items-center'>
          <span className="flex">
            <span className="animate-ping relative right-[-20px] h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
            <span className="absolute rounded-full h-5 w-5 bg-sky-500"></span>
          </span>
        </div>
      )}
      {loadingErrMsg && !loading && <div>{loadingErrMsg}</div>}
      {!loading && !loadingErrMsg && (
        <div>
          <div>{tripData}</div>
        </div>
      )}
    </>
  );
}

export default Page;



// import React,{useEffect,useState} from 'react';
// import { tripFetchApi } from '../utils/tripApi';


// ///this method we will use for fetching data
// const Page = () => {
//   const [tripData, setTripData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [loadingErrMsg, setLoadingErrMsg] = useState(true)

//   const routeData={
//     tenantId: 'tenantId_xyz0001',
//     tripId: 'tripId_abc6548',
//     empId: 'empId_77666t'
//    }

 
   
 
//    useEffect(() => {
//      (async function () {
//        try {
//          const { data, error } = await tripFetchApi(routeData.tripId, routeData.tenantId, routeData.empId);
 
//          if (error) {
//            setLoadingErrMsg(`Error (${error.status}): ${error.message}`);
//          } else {
//            setTripData(data);
//          }
 
//          setLoading(false);
//        } catch (error) {
//          setLoadingErrMsg(`Error fetching trip data: ${error.message}`);
//          setLoading(false);
//        }
//      })();
//    }, []);

//   return (
//     <>
//     {loading && <div className='min-w-screen min-h-screen flex justify-center items-center'><span className="flex">
//   <span className="animate-ping relative right-[-20px]  h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
//   <span className="abosolute   rounded-full h-5 w-5 bg-sky-500"></span>
// </span></div>}
//       {loadingErrMsg && !loading && <div>{loadingErrMsg}</div>}
//       {!loading && !loadingErrMsg && (
//         <div>
//           <div>{tripData}</div>
//         </div>
//       )} 
//     </>
//   )
// }

// export default Page
