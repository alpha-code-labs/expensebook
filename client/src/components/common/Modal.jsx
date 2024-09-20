/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */

import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import Input from "./Input";
import { cancel_icon } from "../../assets";

export default function (props) {
  const modalRef = useRef(null);
  const [showModal, setShowModal] = [props.showModal, props.setShowModal];
  const { skipable, handleConfirm, children } = props;

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);

  const handleOutsideClick = (e) => {
    if (!modalRef.current.contains(e.target)) {
      if (skipable) {
        setShowModal(false);
      }
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed z-10 flex justify-center items-start inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60"
          onClick={handleOutsideClick}
        >
          <div
            ref={modalRef}
            className="z-10 sm:w-[50%] lg:w-[80%]  xl:w-[50%] bg-white rounded-b-lg shadow-md max-h-screen overflow-hidden"
          >
            <div className="rounded-lg relative">
              <div className="overflow-y-auto max-h-screen ">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
