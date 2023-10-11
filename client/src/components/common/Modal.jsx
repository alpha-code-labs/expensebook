import { useState, useEffect, useRef } from "react";

export default function Modal(props){

    const [showModal, setShowModal] = useState(true)
    const modalRef = useRef(null)
    const { children, skipable } = props
   // const skipable = props.skipable || true
    console.log(skipable, 'skipable')

    useEffect(() => {
        const handleClick = (event) => {
          event.stopPropagation()
          if (skipable && modalRef.current && !modalRef.current.contains(event.target)) {
              setShowModal(false)
          }
        };
        document.addEventListener("click", handleClick)
  
        return () => {
          console.log('removing dropdown')
          document.removeEventListener("click", handleClick)
        }
  
      }, []);

    return(
        <>
            {showModal && <div className="fixed flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div ref={modalRef} className='z-10 max-w-[600px] w-[60%] min-h-[200px] scroll-none bg-white rounded-lg shadow-md'>
                    {children}
                </div>
            </div>}
        </>)
}