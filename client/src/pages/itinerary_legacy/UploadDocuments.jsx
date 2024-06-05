import upload_icon from '../../assets/upload.svg'
import { useState, useEffect } from 'react'
import Upload from '../../components/common/Upload'
import file_icon from '../../assets/teenyicons_csv-solid.svg'

export default function UploadDocuments(props){

    const [selectedFile,setSelectedFile] = useState(null)
    const [fileSelected, setFileSelected] = useState(null)

    return(<>
        <div className="py-8">
            <div className="flex gap-2">
                <p className='text-base font-medium text-neutral-700 font-cabin'>Upload trip related documents</p>
                <p className='text-base font-medium text-neutral-500 font-cabin'>{`(Optional)`}</p>
            </div>

            <Upload selectedFile={selectedFile} 
                    setSelectedFile={setSelectedFile} 
                    fileSelected={fileSelected} 
                    setFileSelected={setFileSelected} />

            {fileSelected ? (
                <div className="flex flex-col items-start justify-start gap-[8px] text-[12px]">
                <img
                  className="relative w-10 h-10 overflow-hidden shrink-0"
                  alt=""
                  src={file_icon}
                />
                <div className="relative font-medium inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[43px]">
                  {selectedFile.name}
                </div>
              </div>
            ) : (
              null
            )}

            <hr className='mt-8' />
        </div>
    </>)
}