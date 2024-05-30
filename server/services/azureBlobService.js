const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");


const account = "blobstorage318";
const accountKey = "n3XBU6on7FoS9VjR7zzKAVIYll5lTdgbiyGDtZ/zRoGmbkXyftizOGZExZQtIbIriSpTc/beGyS7+ASt9fXxBw==";

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);


var containerName = 'democontainer1';

async function uploadToAzure(filePath) {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    var blobName = "newblob" + new Date().getTime();
   
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadBlobResponse = await blockBlobClient.upload(filePath, filePath.length);
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
}


export {uploadToAzure}
