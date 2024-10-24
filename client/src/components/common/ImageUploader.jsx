// import React, { useState } from 'react';
// // import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
// // import { StorageSharedKeyCredential } from '@azure/storage-blob';

// const ImageUploader = ({ onSuccess }) => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [imageUrl, setImageUrl] = useState('');

//     const storageAccountName = import.meta.env.REACT_APP_STORAGE_ACCOUNT_NAME;
//     const storageAccountKey = import.meta.env.REACT_APP_STORAGE_ACCOUNT_KEY;
//     const containerName = import.meta.env.REACT_APP_CONTAINER_NAME;

//     const handleFileChange = (event) => {
//         setSelectedFile(event.target.files[0]);
//     };

//     const uploadImage = async () => {
//         if (!selectedFile) {
//             alert('Please select a file first.');
//             return;
//         }

//         const sharedKeyCredential = new StorageSharedKeyCredential(storageAccountName, storageAccountKey);
//         const blobServiceClient = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net`, sharedKeyCredential);
//         const containerClient = blobServiceClient.getContainerClient(containerName);
//         const blobName = `${Date.now()}-${selectedFile.name}`;
//         const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//         try {
//             const response = await blockBlobClient.uploadData(selectedFile);
//             const uploadedImageUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}`;
//             setImageUrl(uploadedImageUrl);
//             onSuccess(uploadedImageUrl); // Call parent component's success handler
//             alert('Image uploaded successfully!');
//         } catch (error) {
//             console.error('Error uploading image:', error);
//             alert('Failed to upload image.');
//         }
//     };

//     return (
//         <div>
//             <h2>Upload Image</h2>
//             <input type="file" onChange={handleFileChange} />
//             <button onClick={uploadImage}>Upload</button>
//             {imageUrl && (
//                 <div>
//                     <h3>Uploaded Image Preview:</h3>
//                     <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ImageUploader;
