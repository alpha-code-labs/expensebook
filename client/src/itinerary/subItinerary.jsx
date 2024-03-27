import React from 'react'

const SubItinerary = ({titleText, pickupTime, pickupAddress, dropAddress}) => {


  return (
    <div className='flex flex-inline justify-between items-center'>
      <div className=''>
              <h1 className='font-medium text-base font-inter mb-2'>{titleText  || '--'} </h1>
  
              <div className='text-sm'>
                <span className='text-gray-800'>Preferred Time : </span>
                {pickupTime  || '--'}
  
              </div>
              <div className='flex flex-col '>
              <div className='text-sm w-auto'>
                <span className='text-gray-800 text-center'>Pick-Up : </span>
                {/* {tripData.boardingTransfer.pickupAddress} */}
                {pickupAddress || '--'}
               
  
              </div>
              <div className='text-sm'>
              <span className='text-gray-800 '>Drop-Off : </span>
              {dropAddress  || '--'}
               
  
              </div>
              </div>
      </div>
      
      {/* <div onClick={handleOpenModal} className='p-3 bg-slate-100 rounded-full m-4 hover:bg-red-100'>
            <img src={cancel} alt="double arrow" width={20} height={20} />
      </div> */}
      {/* <Modal
      handleOperation={tripCancellationApi}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          itineraryId={itineraryId}          
          content="Are you sure ! you want to cancel the hotel Itinerary ?"
          // onConfirm={handleConfirm}
          onCancel={handleCancel}
          routeData={routeData}
          handleOpenOverlay={handleOpenOverlay}
        /> */}
  
      </div>
  )
}

export default SubItinerary
