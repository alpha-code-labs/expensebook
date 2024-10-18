import { BlobServiceClient } from "@azure/storage-blob";
async function uploadFileToAzure(file, blobEndpoint, containerName) {
    try {
        const blobServiceClient = new BlobServiceClient(blobEndpoint);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(file.name);
        const blockBlobClient = blobClient.getBlockBlobClient();
      
        const result = await blockBlobClient.uploadBrowserData(file, {
            blobHTTPHeaders: { blobContentType: file.type },
            blockSize: 4 * 1024 * 1024, // 4MB block size
            concurrency: 20, // Number of simultaneous uploads
            onProgress: ev => console.log(ev)
        });

        console.log(`Upload of file '${file.name}' completed`);
        return { success: true, result }; // Return the result for more information
    } catch (e) {
        console.error(e);
        return { success: false, error: e.message }; // Include error message in the response
    }
}


export default uploadFileToAzure