// Function to calculate the difference in days between two dates
export function calculateDateDifferenceInDays(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const differenceInDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  
    return differenceInDays;
}

const parseTimeToMinutes = (time) => {
  if (typeof time !== 'string') {
      throw new TypeError(`Expected a string, but got ${typeof time}`);
  }
  console.log("Time:", time);
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Function to check if a flight is in the future
const isFlightInFuture = (flight, currentDate, currentTime) => {
  const flightDate = new Date(flight.bkd_date);
  const flightTime = parseTimeToMinutes(flight.bkd_time ?? '00:00');

  const flightYear = flightDate.getFullYear();
  const flightMonth = flightDate.getMonth();
  const flightDay = flightDate.getDate();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Debug output
  console.log(`Flight: ${flight.bkd_date} ${flight.bkd_time}`);
  console.log(`Current Date: ${currentDate.toISOString().split('T')[0]}`);
  console.log(`Current Time in Minutes: ${currentTime}`);

  // Check if the flight date is in the future
  if (flightYear > currentYear ||
      (flightYear === currentYear && flightMonth > currentMonth) ||
      (flightYear === currentYear && flightMonth === currentMonth && flightDay > currentDay)) {
      return true;
  }

  // If the flight date is today, check the time
  if (flightYear === currentYear && flightMonth === currentMonth && flightDay === currentDay) {
      return flightTime >= currentTime;
  }

  return false;
};

// Main function to filter flights
export const filterFutureFlights = (flights) => {
  const statusName = ['booked', 'pending approval'];
  const currentDate = new Date(); 
  const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes(); 
  
  return flights.filter(flight => 
      isFlightInFuture(flight, currentDate, currentTime) &&
      statusName.includes(flight.status)
  );
};

// Function to check if a Hotel is in the future
const isHotelsInFuture = (hotel, currentDate, currentTime) => {
    const flightDate = new Date(hotel.bkd_date);
    const tempPastTime = '12:48'

    const flightTime = parseTimeToMinutes(hotel.bkd_time ?? tempPastTime);
  
    const flightYear = flightDate.getFullYear();
    const flightMonth = flightDate.getMonth();
    const flightDay = flightDate.getDate();
  
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
  
    // Debug output
    console.log(`Flight: ${hotel.bkd_date} ${hotel.bkd_time}`);
    console.log(`Current Date: ${currentDate.toISOString().split('T')[0]}`);
    console.log(`Current Time in Minutes: ${currentTime}`);
  
    // Check if the hotel date is in the future
    if (flightYear > currentYear ||
        (flightYear === currentYear && flightMonth > currentMonth) ||
        (flightYear === currentYear && flightMonth === currentMonth && flightDay > currentDay)) {
      return true;
    }

    // If the hotel date is today, check the time
    if (flightYear === currentYear && flightMonth === currentMonth && flightDay === currentDay) {
      return flightTime >= currentTime;
    }
  
    return false;
};

  // Main function to filter hotels
export const filterFutureHotels = (hotels) => {
    const statusToShow = ['booked', 'pending approval']
    const currentDate = new Date(); 
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes(); 
    return hotels
    .filter(hotel => 
        isHotelsInFuture(hotel, currentDate, currentTime)
    )
    .filter(hotel => statusToShow.includes(hotel.status))
};




