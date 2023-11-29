import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import HollowButton from "../../components/common/HollowButton"

export default function (props){
    const navigate = useNavigate()
    const {tenantId} = useParams()

    return(<>
        
        <Icon/>
        <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10 bg-white rounded shadow'>
                <div className="flex justify-between">
                    <div className="gap-2">
                        <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                            This section contains a few other setup's that are required for our system.
                        </p>
                    </div>
                    <div className="">
                        <HollowButton title='Skip' showIcon={false} />
                    </div>
                </div>

                <div className="w-[200px]  mt-10">
                    <Button text='Continue' onClick={()=>navigate(`/${tenantId}/others/multicurrency`)} />
                </div>

            </div>
        </div>
    </>)
}