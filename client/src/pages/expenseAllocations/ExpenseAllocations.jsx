import back_icon from '../../assets/arrow-left.svg'
import Icon from '../../components/common/Icon'
import HollowButton from '../../components/common/HollowButton';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function (props) {
    const [showSkipModal, setShowSkipModal] = useState(false);
    const navigate = useNavigate();
    const {tenantId} = useParams()

    return(<>

        <Icon/>
        { <div className="bg-slate-50 min-h-calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full">
            
            <div className='px-6 py-10 bg-white rounded shadow w-full'>
               
                {/* rest of the section */}
                <div className='mt-10 w-full flex flex-col gap-4 text text-lg font-cabin text-neutral-800 '>  
                    

                Now we will configure the way your company allocates travel, travel expenses and non travel expenses.
                This will help you track your expenses as per the standards in your organisation.
                <br/><br/>
                Please select continue to proceed for setup | Select Skip to move to the next section
                    
                    <div className='inline-flex w-full justify-between mt-10'>
                        <div className='w-[250px]'>
                            <Button text='Continue' onClick={()=>navigate(`travel`, {state:{tenantId}})} />
                        </div>
                        <div className='w-[250px] inline-flex justify-end'>
                            <HollowButton title='Skip' onClick={()=>setShowSkipModal(true)} />
                        </div>
                    </div>
                </div>

            </div>

            <Modal showModal={showSkipModal} setShowModal={setShowSkipModal} skipable={true}>
                <div className='p-10 text text-xl font-cabin'>
                    Your system will be setup without a way to allocate expenses. You can always configure this section later.

                    <div className='w-[200px] mt-10'>
                        <Button text='Sure' onClick={()=>navigate(`/${tenantId}/groups`)} />
                    </div>
                </div>
                
            </Modal>

        </div>}
        
        </>
    );
  }




