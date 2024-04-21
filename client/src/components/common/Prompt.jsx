import { useEffect, useState } from "react"
import { motion, useCycle } from 'framer-motion';


export default function({prompt, setPrompt, timeout=3000 /* in milliseconds */, bgClear=false, toastLike=false}){

    const [isOpen, toggleOpen] = useCycle(false, true);

    console.log(toastLike, 'toastLike')

    useEffect(()=>{
        if(!toastLike){
            if(prompt.showPrompt){
                document.body.style.overflow = 'hidden'
            }
            else document.body.style.overflow = 'auto'
        }
    },[prompt.showPrompt])

    useEffect(()=>{
        console.log(isOpen, 'isOpen')
        if(prompt.showPrompt){
            toggleOpen(true)
            setTimeout(()=>{
                console.log('this ran.. after 3 seconds')
                toggleOpen(false)
                setPrompt(pre=>({...pre, showPrompt:false}))
            }, timeout+1200)
        }
    },[prompt.showPrompt])

    return(<>
        {!toastLike && prompt.showPrompt && <div className= {`fixed left-0 top-0 flex items-center ${bgClear? '' : 'bg-black/60'} w-[100%] h-[100%] z-[1000] overflow-hidden`} >
                <div className={`transition-all transform(scale(.9)) mx-auto z-[10001] max-w-[600px] min-h-[100px] scroll-none bg-white rounded-lg shadow-md`}>
                    <div className='px-6 py-6 font-cabin font-normal text-lg text-neutral-700'>
                        {prompt.promptMsg}
                    </div>
                </div>
            </div>}

        { toastLike && prompt.showPrompt &&
            <div className={`fixed left-0 top-0 flex flex-reverse  ${bgClear? '' : 'bg-black/60'} w-[100%] h-[100%] z-[1000]`}>
                
                <motion.div className={`-mr-20 mt-20 mx-auto z-[10001] w-[240px] h-[60px] flex items-center justify-center bg-slate-100 border border-sm border-slate-200 rounded-sm shadow-md`}
                  animate={{
                    marginRight: '100px',
                    top:'100px',
                    scale: isOpen ? 1 : .75, // Scale up when open
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 25,
                  }}
                >

                    <div className='px-6 py-6 font-cabin font-normal text-md text-neutral-700'>
                        {prompt.promptMsg}
                    </div>

                </motion.div>

            </div>
            
        }


    </>)
}