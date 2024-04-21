import { useEffect } from "react"
import check_icon from '../../assets/check.svg'

const states = ['not attempted', 'active', 'partially done', 'done', 'skipped'];

export default function Progress({states, orientation='horizontal'}){

    return(<>
        {/* <div className={`z-[1005] fixed left-[250px] top-[50px] flex ${orientation=='vertical'? 'flex-col w-[3px]' : 'flex-row h-[3px]'} gap-8 bg-gray-300 items-center jusitfy-center`}>
            <Dot state='active' title={'Company Information'}/>
            <Dot state='done' title={'Section-2'}/>
            <Dot state='done' title={'Section-3'}/>
        </div> */}

        <Square state='active' />
        <Square/>

    </>)
}



const Dot = ({state, percentage, title})=>{

    const getParentClass = ()=>{
        switch(state){
            case 'active' : {
                return `bg-green-400`;
            }
            case 'not attempted' : {
                return 'bg-grey-100';
            }
            case 'done':{
                'bg-green-400'
            }
        }
    }

    const getChildClass = ()=>{
        switch(state){
            case 'done' : {
                return 'bg-green-400';
            }
            default : {
                return 'bg-white';
            }
        }
    }

    useEffect(()=>{

    },[])

    return(<>
        <div className={`w-6 h-6 rounded-full p-1 ${getParentClass()}`}>
            <div className={`absolute w-4 h-4 scale(1.5) rounded-full ${getChildClass()} text-center`}>
                {state == 'done' && <img src={check_icon} className='w-4 h-4' />}
                <p className={`relative top-[15px] -left-4 text-xs font-cabin text-neutral-400 whitespace-nowrap`}>{title}</p>
            </div>
        </div>
    </>)
}

const Square = ({state, percentage, title})=>{

    

    return(<div className="items-center justify-center">
        <div className={`${state == 'active'? 'bg-indigo-600' : 'bg-indigo-300' } w-[100px] h-[40px] flex items-center p-2`}>
            <p className="text-white">Section 1</p>
        </div>
    </div>)
}