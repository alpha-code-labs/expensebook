import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cancel } from '../assets/icon';

const TripMS = ({ visible, setVisible, src }) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [visible]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: '-100%' },
    visible: { opacity: 1, y: '0' },
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="relative">

          <motion.div
            className="fixed inset-0 w-[100%] h-[100%] left-0 top-0 bg-black/70 z-10"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="fixed w-[100%] left-0 top-0 md:w-[80%] lg:w-[60%] xl:w-[50%] sm:h-[95%] h-[100%] md:left-[20%] xl:left-[25%] blur-0 px-6 sm:px-0 sm:rounded-b-lg shadow-lg z-[100] bg-white shadow-black/50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.5 }}
          >
            <div
              onClick={() => setVisible(false)}
              className="w-fit bg-red-100 z-10 top-2 right-4 absolute cursor-pointer rounded-full border border-white"
            >
              <img src={cancel} className="w-5 h-5" alt="Cancel icon" />
            </div>

            <iframe
              src={src}
              className="rounded-lg w-[100%] h-[100%]"
              title="Embedded Content"
            ></iframe>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TripMS;

// import React, { useEffect } from 'react';
// import { cancel } from '../assets/icon';

// const TripMS = ({ visible, setVisible, src }) => {

//   useEffect(() => {
//     if (visible) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//   }, [visible]);


//   return (

//     visible && (
//       <div className='relative'>
//       <div className='fixed drop-shadow-sm inset-0   w-[100%] h-[100%] left-0 top-0 bg-black/70 z-10'>

//        </div>
//       <div className="fixed  w-[100%]  left-0 top-0  md:w-[80%] lg:w-[60%] xl:w-[50%] sm:h-[95%]  h-[100%]    md:left-[20%] lg:[10%] xl:left-[25%] blur-0 px-6 sm:px-0 sm:rounded-b-lg shadow-lg z-[100]  bg-white shadow-black/50 ">
//       <div onClick={() => setVisible(false)} className='w-fit bg-red-100  z-10 top-2  right-4 absolute cursor-pointer rounded-full border border-white'>
//               <img src={cancel} className='w-5 h-5' alt="Cancel icon"/>
//             </div>
     
//         <iframe
//           src={src}
//           className="rounded-lg w-[100%] h-[100%] "
//           title="Embedded Content"
//         ></iframe>
     
       
//       </div>
//       </div>
//     )
//   );
// };

// export default TripMS;

