import React from "react";
import Modal from "../components/common/Modal";
import { TitleModal } from "../components/common/TinyComponent";

const DashboardModal = () => {
  return (
    <>
      {/* <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(!modalOpen)}
        content={
          <div className="w-full h-auto">
            
             <TitleModal iconFlag={true} text={getTitle()} onClick={() => setModalOpen(false)}/>

            <div className="p-4">{getContent()}</div>
          </div>
        }
      /> */}
    </>
  );
};

export default DashboardModal;
