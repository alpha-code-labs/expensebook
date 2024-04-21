import back_icon from '../../assets/arrow-left.svg'
import Icon from '../../components/common/Icon'
import HollowButton from '../../components/common/HollowButton';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { getTenantGroups_API } from '../../utils/api';
import Error from '../../components/common/Error';
import MainSectionLayout from '../MainSectionLayout';

export default function (props) {
    const [showSkipModal, setShowSkipModal] = useState(false);
    const navigate = useNavigate();
    const {tenantId} = useParams();
    const setGroupData = props.setGroupData
    

    const [alreadyCreatedGroupsData, setAlreadyCreatedGroupsData] = useState([])
    const [showPreviousGroupsModal, setShowPreviousGroupsModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})

    useEffect(()=>{
        (async function(){
            setNetworkStates(pre=>({...pre, isLoading:true}))
            const res = await getTenantGroups_API({tenantId})

            if(res.err){
                setNetworkStates(pre=>({...pre, loadingErrMsg:res.err??'Something went wrong while fetching data'}))
                return
            }

            setAlreadyCreatedGroupsData(res.data.groups)
            if(res.data.groups.length>0){
                setShowPreviousGroupsModal(true)
            }
            console.log(res.data)
            setNetworkStates(pre=>({...pre, isLoading:false}))
        })()
    },[])
    
    const continueWithPreviousSetup = ()=>{
        setGroupData(alreadyCreatedGroupsData)
        navigate(`/${tenantId}/groups/created-groups`)
    }

    return(<>

        <MainSectionLayout>
            {networkStates.isLoading && <Error message={networkStates.loadingErrMsg} /> }
            {!networkStates.isLoading && <>
            
                <div className='px-6 py-10 bg-white'>
                
                    {/* rest of the section */}
                    <div className='mt-10 w-full flex flex-col gap-4 text text-xl font-cabin text-neutral-700 '>  
                        

                        Do you have groups in your organization on which your company policies can be setup

                        
                        <div className='inline-flex w-full justify-between mt-10'>
                            <div className='w-[250px]'>
                                <Button text='Continue' onClick={()=>navigate(`/${tenantId}/groups/select-grouping-headers`, {state:{tenantId}})} />
                            </div>
                            <div className='w-[250px] inline-flex justify-end'>
                                <HollowButton title='Skip' onClick={()=>setShowSkipModal(true)} />
                            </div>
                        </div>
                    </div>

                </div>

                <Modal showModal={showSkipModal} setShowModal={setShowSkipModal} skipable={true}>
                    <div className='p-10 text text-xl font-cabin'>
                        Your system will be setup without a way to enforce policies. You can always configure this section later.

                        <div className='w-[200px] mt-10'>
                            <Button text='Sure' onClick={()=>navigate(`/${tenantId}/others`)} />
                        </div>
                    </div>
                </Modal>

                <Modal showModal={showPreviousGroupsModal} setShowModa={setShowPreviousGroupsModal} skipable={true}>
                    <div className='p-10 text text-xl font-cabin'>
                        You previously created groups for your company. Would you like to continue adding or removing groups with your previous setup 

                        <div className='flex flex-wrap gap-4'>
                            <div className='w-fit mt-10'>
                                <Button text='Yes, I will continue with previous setting' onClick={()=>continueWithPreviousSetup()} />
                            </div>
                            <div className='w-fit mt-10'>
                                <Button text='No, I will configure everything again' onClick={()=>setShowPreviousGroupsModal(false)} />
                            </div>
                        </div>
                    </div>
                </Modal>
                
                </>
            }
        </MainSectionLayout>
        </>
    );
  }
