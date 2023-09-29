import React from 'react';
import styles from '../styles/PopupMessage.module.css';
import xButton from '../assets/x.svg'; 
import { useNavigate } from 'react-router-dom';

function PopupMessage({ title, message, onClose }) {
  const navigate = useNavigate();

  const onClickContinue = () => {
    navigate('/next-page')
  }
  
  return (
    <div className={styles.Frame364}>
      <div className="X w-6 h-6 left-[648px] top-[24px] absolute" onClick={onClose}>
        <img src={xButton} alt="X button" />
      </div>
      <div className="Frame518 left-[32px] top-[32px] absolute flex-col justify-start items-start gap-6 inline-flex">
        <div className="Frame517 flex-col justify-start items-start gap-4 flex">
          <div className="TripRequestSubmitted text-neutral-700 text-2xl font-semibold font-['Cabin']">
            {title}
          </div>
          <div className="TheRequestForThisTripHasBeenSentForApprovalYouWillReceiveAnUpdateOnceTheyApproveOrDenyThisRequest w-96 text-zinc-400 text-base font-normal font-['Cabin']">
            {message}
          </div>
        </div>
        <div className="Frame388 w-48 h-12 px-8 py-4 bg-indigo-600 rounded-3xl justify-center items-center gap-2 inline-flex">
          <div className="Continue text-center text-white text-base font-medium font-['Cabin']" onClick={onClickContinue}>
            Continue
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupMessage;
