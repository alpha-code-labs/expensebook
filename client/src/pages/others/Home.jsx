import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import HollowButton from "../../components/common/HollowButton"
import MainSectionLayout from "../MainSectionLayout"

export default function (props){
    const navigate = useNavigate()
    const {tenantId} = useParams()

    return(<>
        <MainSectionLayout>
            <div className='px-6 py-10 bg-white'>
                <div className="flex justify-between">
                    <div className="gap-2">
                        <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                            This section outlines additional setup requirements for our system
                        </p>
                    </div>
                    {/* <div className="">
                        <HollowButton title='Skip' onClick={`/${tenantId}/onboarding-completed`} showIcon={false} />
                    </div> */}
                </div>

                <div className="w-[200px]  mt-10">
                    <Button text='Continue' onClick={()=>navigate(`/${tenantId}/others/multicurrency`)} />
                </div>
            </div>
        </MainSectionLayout>
    </>)
}