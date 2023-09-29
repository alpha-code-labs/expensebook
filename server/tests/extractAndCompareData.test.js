import { expect } from 'chai';
import { extractAndCompareData } from '../scheduler/extractAndCompareData.js'; 

describe('extractAndCompareData', () => {
  it('should extract and process data correctly', async () => {
    const processedData = await extractAndCompareData();
     
    // Add your assertions here to test the processed data
    expect(processedData).to.be.an('object'); // Change this line to expect an object
    // You can also add more specific assertions for the properties of the object if needed
  }).timeout(5000); // Set the timeout to 5 seconds
});
