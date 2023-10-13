import upload_icon from '../../assets/upload.svg'

export default function UploadDocuments(props){
    return(<>
        <div className="py-8">
            <div className="flex gap-2">
                <p className='text-base font-medium text-neutral-700 font-cabin'>Upload trip related documents</p>
                <p className='text-base font-medium text-neutral-500 font-cabin'>{`(Optional)`}</p>
            </div>

            <div className="flex mt-4 flex-wrap">
                <div className="flex max-w-[583px] h-[153px] w-full bg-stone-100 rounded-md border-neutral-400 justify-center items-center px-6 py-2">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <div className="w-6 h-6 relative">
                            <img src={upload_icon}/>
                        </div>
                        <div className="text-center">
                            <span className="text-neutral-500 text-sm font-normal font-cabin">Drag and drop or </span>
                            <span className="text-indigo-600 text-sm font-normal font-cabin underline cursor-pointer">Browse</span>
                        </div>
                    </div>
                </div>
                {/* uploaded documents*/}
                <div>

                </div>
            </div>
            <hr className='mt-8' />
        </div>
    </>)
}