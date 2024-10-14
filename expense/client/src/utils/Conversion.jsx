import { useState, useRef } from 'react';
import axios from 'axios';

const useCurrencyConversion = () => {
  const [conversionRate, setConversionRate] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const currencyRef = useRef('');
  const totalAmountRef = useRef(0);
  const personalAmountRef = useRef(0);

  const fetchConversionRate = async (currency, totalAmount, personalAmount) => {
    setLoading(true);
    setErrorMessage('');

    try {
      if (
        currency !== currencyRef.current ||
        totalAmount !== totalAmountRef.current ||
        personalAmount !== personalAmountRef.current
      ) {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/${currency}`
        );

        // Assuming response.data.rates contains conversion rates
        setConversionRate(response.data.rates[currency]);

        // Update refs to the current values to avoid unnecessary API calls
        currencyRef.current = currency;
        totalAmountRef.current = totalAmount;
        personalAmountRef.current = personalAmount;
      }
    } catch (error) {
      setErrorMessage('Failed to fetch conversion rate. Please try again.');
      console.error('Error fetching conversion rate:', error);
    } finally {
      setLoading(false);
    }
  };



  return { fetchConversionRate, conversionData:conversionRate, loading, errorMessage };
};

export default useCurrencyConversion;
