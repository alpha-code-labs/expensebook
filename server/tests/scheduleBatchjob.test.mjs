import { expect } from 'chai';
import sinon from 'sinon';
import { startBatchJob } from '../scheduler/scheduleBatchJob.js';
import cron from 'node-cron';

describe('Batch Job', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
  });

  it('should run the batch job successfully', async () => {
    const cronScheduleStub = sinon.stub(cron, 'schedule');

    // Call the batch job function
    startBatchJob();

    // Advance the clock to trigger the cron job immediately
    clock.tick(0);

    // Assert that cron.schedule was called
    expect(cronScheduleStub.calledOnce).to.be.true;

    // You can add more assertions as needed
  });

  it('should handle errors gracefully', async () => {
    const cronScheduleStub = sinon.stub(cron, 'schedule');
    // Stub other dependencies as needed for error testing

    // Make cron.schedule throw an error
    cronScheduleStub.throws(new Error('Cron job scheduling error'));

    try {
      // Call the batch job function
      startBatchJob();

      // Advance the clock to trigger the cron job immediately
      clock.tick(0);

      // Add assertions for error handling
      // For example, you can assert that the error message matches the expected error message
      expect(true).to.be.false; // This line is a placeholder, replace it with appropriate assertions
    } catch (error) {
      // Handle the error here or add assertions for error handling
      expect(error.message).to.equal('Cron job scheduling error'); // Replace with your expected error message
    }
  });
});
