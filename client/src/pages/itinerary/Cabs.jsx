import Select from "../../components/common/Select"
import Date from "../../components/common/Date"
import ShowCabDates from "../../components/common/showCabDates"
import Checkbox from "../../components/common/Checkbox"


export default function Cabs(props){

    const allowedCabClass = props.allowedCabClass
    const cabClass = props.cabClass
    const handleCabClassChange = props.handleCabClassChange
    const cabClassViolationMessage = props.cabClassViolationMessage
    const needsFullDayCab = props.needsFullDayCab
    const setNeedsFullDayCab = props.setNeedsFullDayCab
    const cabDates = props.cabDates
    const setCabDates = props.setCabDates


    return(<>
    <div className="flex gap-2 items-center">
                    <p className="text-neutral-700 text-sm font-normal font-cabin">
                        Will you need a full day cab?
                    </p>
                    <Checkbox checked={needsFullDayCab} onClick={(e)=>{setNeedsFullDayCab(e.target.checked)}} />
            </div>

            {needsFullDayCab && 
            <>
                <div  className="flex flex-wrap gap-8 mt-8 items-center">
                        <Date onSelect={(date)=>{setCabDates(pre=>[...pre, date])} } />
                        {allowedCabClass && allowedCabClass.length>0 && 
                        <Select options={allowedCabClass}
                                title='Cab Class'
                                validRange={{min:null, max:null}}
                                placeholder='Select cab class'
                                currentOption={cabClass} 
                                violationMessage={cabClassViolationMessage}
                                onSelect={(option)=>handleCabClassChange(option)} />}
                        <ShowCabDates dates={cabDates} setDates={setCabDates} />
                    </div>    
            </>
            }
    </>)
}