import back_icon from '../../assets/arrow-left.svg'
import Icon from '../../components/common/Icon'
import HollowButton from '../../components/common/HollowButton';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useState } from 'react';

export default function (props) {
    const [showSkipModal, setShowSkipModal] = useState(false);

    return(<>
        { <div className="bg-slate-50 min-h-[100vh] px-[104px] py-20 w-full">
            <Icon/>
            <div className='px-6 py-10 bg-white mt-6 rounded shadow w-full'>
               
                {/* rest of the section */}
                <div className='mt-10 w-full flex flex-col gap-4 text text-2xl font-cabin text-neutral-700 '>  
                    

                    In this section we will configure how your company allocates travel, 
                    its related expenses and non travel expenses 

                    
                    <div className='inline-flex w-full justify-between mt-10'>
                        <div className='w-[250px]'>
                            <Button text='Continue' />
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
                        <Button text='Sure' />
                    </div>
                </div>
                
            </Modal>

        </div>}
        
        </>
    );
  }




