// Function to calculate the difference in days between two dates
export function calculateDateDifferenceInDays(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const differenceInDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  
    return differenceInDays;
  }
  