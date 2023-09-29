// import { useNavigate } from "react-router-dom";
// import { airplay, airplay1, airplay2, airplay3,airplay4,bell, briefcase,
//     frame260, frame2601,frame490,frame505,map } from "../assets/icon";

 

// const UpcomingTrips = () => {
//   const navigate = useNavigate();

//   const onFrameContainer14Click = () => {
//     // Use the navigate function to navigate to the desired link
//     navigate("/macbookair134");
//   };

// //   const onFrameContainer14Click = useCallback(() => {
// //     // Please sync "MacBook Air - 134" to the project
// //   }, []);

//   return (
//     <div className="relative bg-white w-full h-[832px] overflow-hidden text-left text-xs text-white font-cabin">
//       <div className="absolute top-[0px] left-[0px] bg-gray-100 box-border w-[244px] h-[832px] overflow-hidden text-ebgrey-400 border-[1px] border-solid border-gray-200">
//         <div className="absolute top-[101px] left-[0px] flex flex-col items-start justify-start gap-[16px]">
//           <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
//             <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
//               <img
//                 className="relative w-4 h-4 overflow-hidden shrink-0"
//                 alt=""
//                 src={airplay}
//               />
//               <div className="relative">Overview</div>
//             </div>
//           </div>
//           <div className="relative bg-eb-primary-blue-50 w-[244px] h-8 overflow-hidden shrink-0 text-eb-primary-blue-500">
//             <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
//               <img
//                 className="relative w-4 h-4 overflow-hidden shrink-0"
//                 alt=""
//                 src={airplay1}
//               />
//               <div className="relative font-medium">Travel</div>
//             </div>
//           </div>
//           <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
//             <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
//               <img
//                 className="relative w-4 h-4 overflow-hidden shrink-0"
//                 alt=""
//                 src={airplay2}
//               />
//               <div className="relative">Cash Advances</div>
//             </div>
//           </div>
//           <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
//             <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
//               <img
//                 className="relative w-4 h-4 overflow-hidden shrink-0"
//                 alt=""
//                 src={airplay3}
//               />
//               <div className="relative">Expenses</div>
//             </div>
//           </div>
//         </div>
//         <img
//           className="absolute top-[37px] left-[20px] w-[149px] h-10 overflow-hidden"
//           alt=""
//           src={frame505}
//         />
//       </div>
//       <div className="absolute top-[50px] left-[284px] flex flex-row items-center justify-start gap-[8px] text-base text-black">
//         <img
//           className="relative rounded-81xl w-8 h-8 overflow-hidden shrink-0 object-cover"
//           alt=""
//           src={frame490}
//         />
//         <div className="relative tracking-[-0.04em]">Hello Neo</div>
//       </div>
//       <div className="absolute top-[38px] left-[1184px] w-14 h-14 overflow-hidden text-center">
//         <div className="absolute top-[calc(50%_-_20px)] left-[calc(50%_-_23px)] rounded-81xl bg-white box-border w-10 h-10 border-[1px] border-solid border-eb-primary-blue-300">
//           <img
//             className="absolute top-[calc(50%_-_12px)] left-[calc(50%_-_12px)] w-6 h-6 overflow-hidden"
//             alt=""
//             src={bell}
//           />
//           <div className="absolute top-[-4px] left-[29px] rounded-2xl bg-lightcoral-200 box-border w-5 h-5 overflow-hidden border-[1px] border-solid border-lightcoral-100">
//             <div className="absolute top-[3px] left-[7px] font-medium">3</div>
//           </div>
//         </div>
//       </div>
//       <div className="absolute top-[126px] left-[332px] flex flex-col items-end justify-start gap-[24px] text-center text-base">
//         <div
//           className="rounded-[32px] bg-eb-primary-blue-500 h-12 flex flex-row items-center justify-center py-4 px-8 box-border cursor-pointer"
   
//         >
//           <div className="relative font-medium">New Travel Request</div>
//         </div>
//         <div className="flex flex-col items-start justify-start gap-[24px] text-left text-ebgrey-500">
//           <div className="flex flex-row items-start justify-start gap-[24px]">
//             <div className="relative rounded-2xl bg-white box-border w-[402px] h-[273px] overflow-hidden shrink-0 border-[1px] border-solid border-gainsboro">
//               <div className="absolute top-[-41px] left-[7px]">In Transit</div>
//               <div className="absolute top-[calc(50%_-_81.5px)] left-[calc(50%_-_146.5px)] flex flex-col items-center justify-start gap-[16px] text-ebgrey-600">
//                 <img
//                   className="relative w-32 h-32 overflow-hidden shrink-0"
//                   alt=""
//                   src={frame260}
//                 />
//                 <div className="relative">{`You do not have any trip in transit right now `}</div>
//               </div>
//               <div className="absolute top-[24px] left-[24px] flex flex-row items-center justify-start gap-[16px]">
//                 <img
//                   className="relative w-6 h-6 overflow-hidden shrink-0"
//                   alt=""
//                   src={briefcase}
//                 />
//                 <div className="relative font-medium">Upcoming Trips</div>
//               </div>
//             </div>
//             <div className="relative rounded-2xl bg-white box-border w-[402px] h-[273px] overflow-hidden shrink-0 border-[1px] border-solid border-gainsboro">
//               <div className="absolute top-[-41px] left-[7px]">In Transit</div>
//               <div className="absolute top-[calc(50%_-_81.5px)] left-[calc(50%_-_146.5px)] flex flex-col items-center justify-start gap-[16px] text-ebgrey-600">
//                 <img
//                   className="relative w-32 h-32 overflow-hidden shrink-0"
//                   alt=""
//                   src={frame260}
//                 />
//                 <div className="relative">{`You do not have any trip in transit right now `}</div>
//               </div>
//               <div className="absolute top-[27px] left-[64px] font-medium">
//                 In Transit
//               </div>
//               <img
//                 className="absolute top-[24px] left-[24px] w-6 h-6 overflow-hidden"
//                 alt=""
//                 src={map}
//               />
//             </div>
//           </div>
//           <div className="relative rounded-2xl bg-white box-border w-[828px] h-[257px] overflow-hidden shrink-0 text-ebgrey-600 border-[1px] border-solid border-gainsboro">
//             <div className="absolute top-[24px] left-[24px] flex flex-row items-center justify-start gap-[16px] text-ebgrey-500">
//               <img
//                 className="relative w-6 h-6 overflow-hidden shrink-0"
//                 alt=""
//                 src={airplay4}
//               />
//               <div className="relative font-medium">{`All Trips `}</div>
//             </div>
//             <div className="absolute top-[296px] left-[calc(50%_-_412px)]">{`You do not have any trip in transit right now `}</div>
//             <div className="absolute top-[62px] left-[241px] flex flex-col items-center justify-center gap-[16px]">
//               <img
//                 className="relative w-32 h-32 overflow-hidden shrink-0"
//                 alt=""
//                 src={frame2601}
//               />
//               <div className="relative">
//                 You do not have any trip yet.
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpcomingTrips;
