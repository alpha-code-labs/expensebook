
    

import React, { useEffect, useState } from 'react';
import { file_icon } from "../assets/icon";
import Upload from '../components/common/Upload';

export function DocumentPreview({
  emptyPreview =false,
  selectedFile,
  setIsFileSelected,
  initialFile,
  isFileSelected,
  setSelectedFile,
}) {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    if (selectedFile) {
      const newFileUrl = URL.createObjectURL(selectedFile);
      setFileUrl(newFileUrl);
    }

    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [selectedFile]);

  return (
    <div className="h-full w-full">
      {selectedFile ? (
        <div className="w-full h-full overflow-auto flex justify-center">
          {selectedFile.type.startsWith('image/') ? (
            <img src={fileUrl} alt="Preview" className="h-full w-auto" />
          ) : selectedFile.type === 'application/pdf' ? (
            <embed src={fileUrl} type="application/pdf" className="h-full w-full" />
          ) : (
            <p>Preview not available for this file type.</p>
          )}
        </div>
      ) : !initialFile && emptyPreview ? (
        <div className="flex items-center justify-center w-full h-full">
          <img src={file_icon} className="w-40 h-40" alt="No file selected" />
        </div>
      ) : !initialFile ? (
        <div className="flex items-center justify-center w-full h-full">
          <Upload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            fileSelected={isFileSelected}
            setFileSelected={setIsFileSelected}
          />
        </div>
      ) : (
        <div className="h-full w-full overflow-y-auto flex items-center justify-center">
          {initialFile.toLowerCase().endsWith('.pdf') ? (
            <div className="w-full h-full">
              <embed src={initialFile} type="application/pdf" className="h-full w-full" />
            </div>
          ) : (
            <img src={initialFile} alt="Initial Document Preview" className="" />
          )}
        </div>
      )}
    </div>
  );
}
