import { useEffect, useState } from 'react';
import check_icon from '../../assets/check.svg';
import { motion } from 'framer-motion';
import { camelCaseToTitleCase } from '../../utils/handyFunctions';
import { useNavigate } from 'react-router-dom';


//states -> done, not attempted, attempted, skipped

export default function({
    progress,
    setProgress,
}){

    const navigate = useNavigate();
    const tenantId = '65f7d5442f8fdd7d542eed07';
    const baseURL = `http://localhost:5173`

    const sections = [1,2,3,4,5]

    const handleActiveSection = (section)=>{
        if(progress.activeSection != section){
            setProgress(pre=>({...pre, activeSection:section}))
            if(progress.sections[section].navigationUri != null){
                navigate(`/${tenantId}${progress.sections[section].navigationUri}/`);
            }
        }
    }

    return(
        <>  
            {progress == undefined || progress == null && <div className='fixed bg-white pl-2 pt-8 pr-2 top-[63px] left-navigation w-[230px] h-[100%]  z-[1000] flex flex-col'>
                {sections.map((itm, ind)=>(<>
                    <div className='relative h-[60px] flex items-center rounded-md bg-gray-200'>

                        <div className='px-2 flex flex-col gap-2'>
                            <p className='bg-gray-100 w-full w-[60px] h-[18px] rounded-sm animate-pulse'></p>
                            <p className='bg-gray-100 w-full w-[85px] h-[15px] rounded-sm animate-pulse'></p>
                        </div>

                        <div className='animate-pulse absolute right-[18px] w-7 h-7 bg-gray-100 rounded-full p-1 flex items-center justify-center'>
                            
                        </div>
                    </div>

                    {ind!=sections.length-1 && <div className='ml-8 w-2 h-6 bg-gray-200' />}
                    </>
                ))}
            </div> }

            {progress != undefined && progress!= null && <div className='fixed bg-white pl-2 pt-8 pr-2 top-[63px] left-navigation w-[230px] z-[1000] h-[90%] flex flex-col overflow-y-scroll overflow-x-hidden dropdown-scroll mb-4 pb-4'>
                
               {Object.keys(progress?.sections??{}).map((section, sectionIndex)=>(<>
                    <div className='relative rounded-md'>

                        <div 
                            onClick={()=>handleActiveSection(section)}
                            className={`relative h-[60px] bg-indigo-400 flex items-center cursor-pointer ${progress.activeSection == section && 'outline outline-2 outline-gray-100'} ${progress.activeSection == section && progress.sections[section].totalSubsections > 1? 'rounded-t-md' : 'rounded-md'}`}>
                            <div className='px-2'>
                                <p className='  flex items-center text-gray-100 w-full text-lg font-cabin'>{camelCaseToTitleCase(section)}</p>
                                {progress.sections[section]?.title != undefined && <p className='flex items-center text-gray-200 w-full text-xs'>{progress.sections[section].title}</p>}
                            </div>
                            
                            {section == progress.activeSection && <div className='absolute triangle-right -right-[9px]' />}
                            
                            {progress.sections[section].state == 'skipped' && <div className='absolute right-[18px]'> 
                                <p className='font-mono text-gray-100 text-xs'>skipped</p>
                            </div>}

                            {progress.sections[section]?.state != undefined && progress.sections[section].state != 'done' && progress.sections[section].state != 'skipped' &&  progress.sections[section].totalSubsections != 0 &&
                                <div className='absolute right-[18px] w-7 h-7 bg-blue-100 rounded-full text-gray-700 text-xs items-center flex justify-center gap-[1px]'> 
                                    <p className='text-neutral-700'>{progress.sections[section].coveredSubsections}</p>
                                    <p>/</p>
                                    <p>{progress.sections[section].totalSubsections}</p>
                                </div>
                            }

                            {progress.sections[section]?.state == 'done' && 
                                <div className='absolute right-[18px] w-7 h-7 bg-green-100 rounded-full p-1 flex items-center justify-center'>
                                    <img src={check_icon} />
                                </div>
                            }

                        </div>
                        
                        { section == progress.activeSection && progress.sections[section].totalSubsections > 1 && <div className='pt-2 bg-indigo-300 h-fit w-full rounded-b-md flex flex-col items-start pl-6'>

                             {
                              progress.sections[section].subsections.map((subsection, subsectionIndex)=>(
                                <>
                                    <div className='flex items-center justify-center gap-2'>
                                        <div className='rounded-full h-4 w-4 bg-blue-100 text-neutral-500 text-sm flex items-center justify-center p-[4px]'>{subsectionIndex+1}</div>
                                        <p className='text-gray-500 text-sm font-cabin w-[130px]'>{subsection.name}</p>
                                        {subsection.completed && <div className='w-4 h-4 flex-1'>
                                            <img src={check_icon} />
                                        </div>}
                                    </div>

                                    <hr className='py-1 dashed bg-indigo-200'/>
                                </>
                            ))
                            }

                            </div>
                        }
                        
                        {sectionIndex != Object.keys(progress.sections).length-1 && progress?.maxReach != null && progress.maxReach.split(' ')[1] > section.split(' ')[1] && <motion.div initial={{height:'0px'}} animate={{height:'24px'}} className='ml-8 w-2 h-6 bg-indigo-600'></motion.div>}
                        {sectionIndex != Object.keys(progress.sections).length-1 && (progress.maxReach == null || progress.maxReach.split(' ')[1] <= section.split(' ')[1]) && <motion.div initial={{height:'0px'}} animate={{height:'24px'}} className='ml-8 w-2 h-6 bg-gray-100'></motion.div>}
                    </div>
               </>))}

            </div>}
        </>

        
    )
}


{/* <div className='relative h-[60px] flex items-center rounded-md bg-indigo-400'>
                    <div className='px-2'>
                        <p className='flex items-center text-gray-100 w-full  text-lg font-cabin'>Section 1</p>
                        <p className='flex items-center text-gray-200 w-full  text-xs'>HRInformation</p>
                    </div>

                    <div className='absolute right-[18px] w-7 h-7 bg-green-400 rounded-full p-1 flex items-center justify-center'>
                        <img src={check_icon} />
                    </div>
                </div>

                <motion.div initial={{height:'0px'}} animate={{height:'24px'}} className='ml-8 w-2 h-6 bg-indigo-600'></motion.div>      
                
                <div className='relative h-[60px] bg-indigo-400 flex items-center cursor-pointer rounded-md'>
                    <div className='px-2'>
                        <p className='  flex items-center text-gray-100 w-full text-lg font-cabin'>Section 2</p>
                        <p className='flex items-center text-gray-200 w-full text-xs'>Company Information</p>
                    </div>
                    {<div className='absolute triangle-right -right-[2px]' />}
                    <div className='absolute right-[18px]'> 
                        <p className='font-mono text-gray-100 text-xs'>skipped</p>
                    </div>

                </div>

                <motion.div initial={{height:'0px'}} animate={{height:'24px'}} className='ml-8 w-2 h-6 bg-indigo-600'></motion.div>      
                
                <div className='relative max-h-[160px] border border-indigo-700 rounded-md'>

                    <div className='relative h-[60px] bg-indigo-400 flex items-center cursor-pointer rounded-t-md '>
                        <div className='px-2'>
                            <p className='  flex items-center text-gray-100 w-full text-lg font-cabin'>Section 3</p>
                            <p className='flex items-center text-gray-200 w-full text-xs'>Others</p>
                        </div>
                        
                        {<div className='absolute triangle-left -right-[9px]' />}
                        <div className='absolute right-[18px] w-7 h-7 bg-blue-100 rounded-full text-gray-700 text-xs items-center flex justify-center gap-[1px]'> 
                            <p className='text-neutral-700'>3</p>
                            <p>/</p>
                            <p>5</p>
                        </div>
                    </div>

                    <div className='absolute top-[60px]  bg-indigo-300 h-[100px] w-full rounded-b-md flex flex-col items-start pl-6'>
                        <div className='flex items-center justify-center gap-2'>
                            <div className='rounded-full h-4 w-4 bg-blue-100 text-neutral-500 text-sm flex items-center justify-center p-[4px]'>1</div>
                            <p className='text-gray-500 text-sm font-cabin'>Currency Setup</p>
                            <div className='w-4 h-4'>
                            <img src={check_icon} />
                            </div>
                        </div>
                        <div className='flex items-center justify-center gap-2'>
                            <div className='rounded-full h-4 w-4 bg-blue-100 text-neutral-500 text-sm flex items-center justify-center p-[4px]'>2</div>
                            <p className='text-gray-500 text-sm font-cabin'>Roles Setup</p>
                            <div className='w-4 h-4'>
                            <img src={check_icon} />
                            </div>
                        </div>
                        <div className='flex items-center justify-center gap-2'>
                            <div className='rounded-full h-4 w-4 bg-blue-100 text-neutral-500 text-sm flex items-center justify-center p-[4px]'>3</div>
                            <p className='text-gray-500 text-sm font-cabin'>Cash Advance Options</p>
                            <div className='w-4 h-4 tex-xs font-cabin text-gray-500'>
                            skip
                            </div>
                        </div>
                    </div>

                </div>

                <motion.div initial={{height:'24px'}} animate={{height:'24px'}} className='ml-8 w-2 h-6 bg-indigo-100'></motion.div>      

                <div className='h-[60px] bg-indigo-300 rounded-md'>
                </div>

                <motion.div initial={{height:'24px'}} animate={{height:'24px'}} className='ml-8 w-2 h-6 bg-indigo-100'></motion.div>      
                
                <div className='h-[60px] bg-blue-200'>
                </div>
                 */}