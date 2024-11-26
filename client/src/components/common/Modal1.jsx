import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, content }) => {
  
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [isOpen]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: '-100%' },
    visible: { opacity: 1, y: '0' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-start justify-center z-20"
          onClick={handleClickOutside}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
           <div className="absolute inset-0 bg-gray-500 opacity-75 z-10"></div>
          <motion.div
            ref={modalRef}
            className="relative border bg-white h-auto rounded-b-lg text-left overflow-visible transform z-20 shadow-lg md:w-[60%] w-full xl:w-auto"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.5 }}
          >
            <div className="flex max-h-screen justify-center items-start text-center font-inter w-full">
              {content}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
