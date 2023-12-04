import express from 'express';
import { saveOnboardingData } from '../service/onboardingService.js'; 

const router = express.Router();

// Route to trigger saving onboarding data
router.post('/save-onboarding', async (req, res) => {
  try {
    const saveResult = await saveOnboardingData();
    res.status(200).json({ message: saveResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
