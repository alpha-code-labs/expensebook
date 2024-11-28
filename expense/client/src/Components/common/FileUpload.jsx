import React, { useRef, useState } from 'react';
import { loading_icon } from '../../assets/icon';

export default function FileUpload(props) {
  const {
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
    uploadFlag = true
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
            ? 'hover:bg-neutral-700 hover:text-gray-400 bg-indigo-400 text-gray-400 cursor-not-allowed'
            : 'hover:bg-neutral-700 text-white cursor-pointer'
        } h-8 px-4 py-4 bg-neutral-900 rounded-md justify-center items-center gap-2 inline-flex`}
      >
        {loading  ? (
          <div className='flex gap-1 text-center items-center'>
            <img src={loading_icon} className="animate-spin w-5 h-5" alt="Loading" />
            <div className="w-full h-5 text-center text-white text-base font-medium font-cabin">
              {text}
            </div>
          </div>
        ) : (
          <div className="w-full h-5 text-center text-white text-base font-medium font-cabin">
            {text}
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
        onClick={(e) => {
          if (uploadFlag) {
            e.preventDefault(); // Prevent the default click behavior
          }
        }}
      />

      {/* Conditionally render a message or visual indicator if a file is selected */}
      {/* {isFileSelected && (
        <p className="text-green-600 mt-2">File Selected: {selectedFile.name}</p>
      )} */}
    </>
  );
}

