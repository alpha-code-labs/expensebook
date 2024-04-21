import { useEffect, useState } from "react"



export default ()=>{

  return(<>
    <div>
        
    </div>
  </>)
}



// export default () => {
//   const [showIframe, setShowIframe] = useState(true)

//   useEffect(() => {
//     const handleMessage = event => {
//       console.log(event)
//       // Check if the message is coming from the iframe
//       if (event.origin === 'http://192.168.1.7:5174') {
//         // Check the message content or identifier
//         if (event.data === 'closeIframe') {
//           setShowIframe(false)
//         }
//       }
//     };
  
//     // Listen for messages from the iframe
//     window.addEventListener('message', handleMessage);
  
//     return () => {
//       // Clean up event listener
//       window.removeEventListener('message', handleMessage);
//     };
//   }, []);

  
//   return (<>
//     <div className='fixed top-0 left-0 w-full h-[110px] bg-blue-300 items-center justify-content'>
//             <h1>Header</h1>
//     </div>
//     <div className='fixed top-0 left-0 w-[220px] h-full bg-blue-300'>
//     </div>
//     {showIframe && <div className='fixed w-[80%] h-[80%] top-[10%] left-[10%] scroll-y-auto no-scroll shadow-lg bg-white rounded-lg '>
//         <iframe className='w-[100%] h-[100%] rounded-lg no-scroll' src='http://192.168.1.7:5174/modify/660a6d654b838b3120f96404'>

//         </iframe>
//     </div>}
//   </>
  
//   )
// }