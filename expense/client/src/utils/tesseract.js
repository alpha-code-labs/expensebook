import { createWorker } from 'tesseract.js';
import engTrainedData from './trainedData/eng.traineddata';

const worker = createWorker({
  logger: (m) => {
    setProgress(`${m.progress.toFixed(2) * 100}`);
    setStatus(m.status);
  },
});

await worker.load();
await worker.loadLanguage('eng');
await worker.initialize('eng');