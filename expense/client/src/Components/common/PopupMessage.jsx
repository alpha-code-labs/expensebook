import { useState, useEffect, useRef } from "react";

export default function PopupMessage({ message, skipable = true, showPopup, setShowPopup }) {
    const modalRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = showPopup ? 'hidden' : 'visible';
    }, [showPopup]);

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target) && skipable) {
            setShowPopup(false);
        }
    };

    return (
        <>
            {showPopup && (
                <div onClick={handleOutsideClick} className="z-50 fixed overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                    <div ref={modalRef} className="z-10 max-w-[600px] w-[40%] min-h-[100px] scroll-none bg-white rounded-lg shadow-md border-x-4 ring-1 ring-white border-indigo-600">
                        <div className="p-10 text-lg text-neutral-800 capitalize">
                            {message}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
