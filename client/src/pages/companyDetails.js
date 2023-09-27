import React, { useState,useRef } from 'react';
import axios from 'axios';
import DownloadTemplate from '../components/downloadExcelTemplate';



const companyInfo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    // Check if the selected file is an Excel file (xlsx format)
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setSelectedFile(file);
      setFileSelected(true);
    } else {
      setSelectedFile(null);
      setFileSelected(false);
      console.error('Please select a valid Excel file (.xlsx).');
    }
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Make a POST request using Axios
      axios
        .post('http://localhost:3000/api/hrcompanies', formData)
        .then((response) => {
          console.log('File uploaded successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    } else {
      console.error(
        'Without HR information, this system will not work. We have your email id, let us reach out to you'
      );
    }
  };

   const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    
    // Check if the dropped file is an Excel file (xlsx format)
    if (droppedFile && droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setSelectedFile(droppedFile);
      setFileSelected(true);
    } else {
      setSelectedFile(null);
      setFileSelected(false);
      console.error('Please drop a valid Excel file (.xlsx).');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };


  return (
    <div className="relative bg-white w-full h-[932px] overflow-hidden text-left text-[24px] text-ebgrey-500 font-cabin">
    <div className="absolute top-[calc(50%_-_376px)] left-[732px] flex flex-col items-start justify-start gap-[24px]">
      <div className="flex flex-col items-start justify-start gap-[24px]">
        <div className="flex flex-col items-start justify-start gap-[8px]">
          <div className="relative tracking-[-0.04em] font-semibold">
            Tell us a bit about your company
          </div>
          <div className="relative text-sm tracking-[-0.04em] text-ebgrey-400 inline-block w-[229px]">
            Enter the company details.
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-[24px] text-sm">
          <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
            <div className="relative font-medium">Company Name</div>
            <div className="w-[403px] h-[49px] flex flex-row flex-wrap items-start justify-start">
              <input
                className="font-cabin text-sm bg-white self-stretch flex-1 rounded-md flex flex-row items-center justify-start py-2 px-6 border-[1px] border-solid border-ebgrey-200"
                type="text"
                placeholder="Search for a company"
                // value={searchTerm}
                // onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
            <div className="relative font-medium">Business Category</div>
            <div
              className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start cursor-pointer text-darkgray"
            >
              <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                <div className="flex-1 flex flex-row items-center justify-between">
                  <div className="relative">Select business category</div>
                  <img
                    className="relative w-6 h-6 overflow-hidden shrink-0"
                    alt=""
                    src="/chevrondown.svg"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
            <div className="relative font-medium">Team Size</div>
            <div className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start text-darkgray">
              <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                <div className="flex-1 flex flex-row items-center justify-between">
                  <div className="relative">Select the size of your team</div>
                  <img
                    className="relative w-6 h-6 overflow-hidden shrink-0"
                    alt=""
                    src="/chevrondown.svg"
                  />
                </div>
              </div>
            </div>
            
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
            <div className="relative font-medium">Company HQ location</div>
            <div className="w-[403px] h-[49px] flex flex-row flex-wrap items-start justify-start text-justify text-darkgray">
              <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[1px] border-solid border-ebgrey-200">
                <div className="absolute my-0 mx-[!important] top-[16px] left-[24px] z-[0]">
                  Eg. Newyork
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start gap-[16px] text-sm">
          <div className="flex flex-col items-start justify-start gap-[8px]">
            <div className="relative font-medium">HR Details</div>
            <div className="flex flex-row items-start justify-start gap-[16px] text-dimgray">
              <div className="relative tracking-[-0.04em] inline-block w-[257px] shrink-0">
                Upload your company HR details in CSV format
              </div>
              {DownloadTemplate()}
            </div>
          </div>
          <div 
            className="rounded-md bg-whitesmoke box-border h-[153px] flex flex-row items-center justify-start py-2 px-6 text-center text-dimgray border-[1px] border-dashed border-darkgray"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div 
                className="w-[355px] flex flex-col items-center justify-center gap-[16px]"
                onClick={handleUpload}
            >
              <img
                className="relative w-6 h-6 overflow-hidden shrink-0"
                alt=""
                src="/upload.svg"
              />
              <div className="relative tracking-[-0.04em] inline-block w-[229px]">
                <span>{`Drag and drop or `}</span>
                <span 
                  className="[text-decoration:underline] text-blueviolet cursor-pointer"
                >
                  Browse
                </span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".xlsx" // Specify the accepted file type (Excel files)
            />
          </div>
          {fileSelected ? (
              <div className="flex flex-col items-start justify-start gap-[8px] text-[12px]">
              <img
                className="relative w-10 h-10 overflow-hidden shrink-0"
                alt=""
                src="/teenyiconscsvsolid.svg"
              />
              <div className="relative font-medium inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[43px]">
                BMS Data
              </div>
            </div>
          ) : (
            <p>File not uploaded</p>
          )}
        </div>
        <button className="cursor-pointer [border:none] p-4 bg-eb-primary-blue-500 self-stretch rounded-[32px] h-12 flex flex-row items-center justify-center box-border">
          <div 
            className="relative text-[16px] font-medium font-cabin text-white text-left"
            onClick= {handleFileUpload}
            // {() => {
            //   handleFileUpload();
            //   // handleSearchSubmit();
            // }}
            >
            Continue
          </div>
        </button>
    </div>
    <div className="absolute top-[0px] left-[0px] [background:linear-gradient(187.95deg,_rgba(76,_54,_241,_0),_rgba(76,_54,_241,_0.03)_9.19%,_rgba(76,_54,_241,_0.06)_17.67%,_rgba(76,_54,_241,_0.1)_25.54%,_rgba(76,_54,_241,_0.14)_32.86%,_rgba(76,_54,_241,_0.19)_39.72%,_rgba(76,_54,_241,_0.25)_46.19%,_rgba(76,_54,_241,_0.31)_52.36%,_rgba(76,_54,_241,_0.38)_58.3%,_rgba(76,_54,_241,_0.46)_64.08%,_rgba(76,_54,_241,_0.53)_69.79%,_rgba(76,_54,_241,_0.62)_75.51%,_rgba(76,_54,_241,_0.71)_81.31%,_rgba(76,_54,_241,_0.8)_87.28%,_rgba(76,_54,_241,_0.9)_93.48%,_#4c36f1)] w-[628px] h-[932px] overflow-hidden text-center text-[32px]">
      <img
        className="absolute h-[51.13%] w-[80.73%] top-[45.06%] right-[9.55%] bottom-[3.81%] left-[9.71%] max-w-full overflow-hidden max-h-full"
        alt=""
        src="/tripamico.svg"
      />
      <div className="absolute top-[267px] left-[calc(50%_-_219.5px)] flex flex-col items-start justify-start">
        <div className="relative tracking-[-0.04em] font-semibold inline-block w-[438px]">
          Your business expense booking could not get simpler
        </div>
      </div>
      <img
        className="absolute top-[163px] left-[calc(50%_-_134px)] w-[267px] h-16 overflow-hidden"
        alt=""
        src="/frame-505.svg"
      />
    </div>
  </div> 
  );
};

export default companyInfo;
