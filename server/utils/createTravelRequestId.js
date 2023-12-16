
export default function createTravelRequestId(companyName, count) {
  
    // Generate the six-digit number with leading zeros
    const sixDigitNumber = count.toString().padStart(6, '0');
  
    // Create the travelRequestId using the specified format
    return `TR${companyName.substring(0, 2).toUpperCase()}${sixDigitNumber}`;
}

