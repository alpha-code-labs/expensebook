import React, { useRef, useState } from 'react';
import { attachment_icon, loading_icon } from '../assets/icon';

export default function FileUpload(props) {
  const {
    id, 
    setFileId, 
    text, 
    onClick, 
    variant = 'fit', 
    disabled = false, 
    loading = false, 
    onFileSelect,  
    selectedFile,  
    setSelectedFile, 
    isFileSelected, 
    setIsFileSelected, 
  } = props;
  
  const fileInputRef = useRef(null);

  const handleClick = (e) => {
    if (!disabled && !loading) {
      if (fileInputRef.current) {
        fileInputRef.current.click(); // Trigger the file input dialog
      }
      onClick && onClick(e); // Call the onClick handler if provided
    } else {
      console.log('disabled or already loading', disabled);
      
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the uploaded file in state
      setIsFileSelected(true); // Set the flag to true
      onFileSelect && onFileSelect(file); // Trigger the callback with the selected file
      if (id){
        console.log('uploadId',id)
        setFileId(id);
      }
      
    } else {
      setIsFileSelected(false); // If no file is selected, reset the flag
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`${variant === 'fit' ? 'w-fit' : 'w-full'} ${
          disabled 
            ? ' hover:text-gray-400 bg-indigo-400 text-gray-400 cursor-not-allowed'
            : ' text-white cursor-pointer'
        } h-8 px-4 py-4  rounded-md justify-center items-center gap-2 inline-flex`}
      >
        {loading  ? (
          <div className='flex gap-1 text-center items-center'>
            <img src={loading_icon} className="animate-spin w-5 h-5" alt="Loading" />
             <img src={attachment_icon} className='w-4 h-4'/>
          </div>
        ) : (
          <div className="w-full h-5 text-center text-white text-base font-medium font-cabin">
           <img src={attachment_icon} className='w-4 h-4'/>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input 
        type="file" 
        accept="image/*,application/pdf"
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />

      {/* Conditionally render a message or visual indicator if a file is selected */}
      {/* {isFileSelected && (
        <p className="text-green-600 mt-2">File Selected: {selectedFile.name}</p>
      )} */}
    </>
  );
}

