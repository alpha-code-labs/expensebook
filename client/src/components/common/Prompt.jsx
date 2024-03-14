import { useEffect, useState } from "react"

export default function({prompt, setPrompt, timeout=3000 /* in milliseconds */}){


    useEffect(()=>{
        if(prompt.showPrompt){
            document.body.style.overflow = 'hidden'
        }
        else document.body.style.overflow = 'auto'
    },[prompt.showPrompt])

    useEffect(()=>{
        if(prompt.showPrompt){
            setTimeout(()=>{
                console.log('this ran.. after 3 seconds')
                setPrompt(pre=>({...pre, showPrompt:false}))
            }, 3000)
        }
    },[prompt.showPrompt])

    return(<>
        {prompt.showPrompt && <div className='fixed left-0 top-0 flex items-center bg-black/60 w-[100%] h-[100%] z-[1000] overflow-hidden'>
                <div className={`transition-all transform(scale(.9)) mx-auto z-[10001] max-w-[600px] min-h-[100px] scroll-none bg-white rounded-lg shadow-md`}>
                    <div className='px-6 py-6 font-cabin font-normal text-lg text-neutral-700'>
                        {prompt.promptMsg}
                    </div>
                </div>
            </div>}
    </>)
}