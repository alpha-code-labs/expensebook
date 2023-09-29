import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import cron from 'node-cron';
import { runCashBatchJob } from '../scheduler/cashBatchJob.js';
import { Trip } from '../models/tripSchema.js';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Cash Batch Job', () => {
  it('should complete successfully', async function () {
    this.timeout(15000); // Set a longer timeout (e.g., 15 seconds)

    // Stub the Mongoose `bulkWrite` method
    const bulkWriteStub = sinon.stub(Trip, 'bulkWrite');
    bulkWriteStub.resolves([{ modifiedCount: 5 }]); // Replace with your desired response

    // Use a promise-based approach to ensure the job completes
    const jobPromise = new Promise(async (resolve, reject) => {
      try {
        await runCashBatchJob();
        resolve('Cash batch job completed successfully.');
      } catch (error) {
        reject(`Cash batch job error: ${error}`);
      }
    });

    // Schedule the cash batch job to run immediately for testing
    const cashBatchJob = cron.schedule('* * * * *', async () => {
      try {
        // Start the job
        await jobPromise;
      } finally {
        // Stop the job after it runs for testing
        cashBatchJob.stop();
      }
    });

    // Start the job
    cashBatchJob.start();

    // Use Chai's `expect` to make assertions about the job's outcome
    const result = await jobPromise;
    expect(result).to.equal('Cash batch job completed successfully.');

    // Restore the stub after the test to avoid affecting other tests
    bulkWriteStub.restore();
  });
});
