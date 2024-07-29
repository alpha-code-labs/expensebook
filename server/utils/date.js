const itinerary = {
    formState: { someField: 'value' },
    hotels: [
      { checkIn_date: '2024-07-25', checkIn_time: '14:00', status: 'confirmed' },
      { checkIn_date: '2024-07-26', checkIn_time: '15:00', status: 'draft' },
      { checkIn_date: '2024-07-27', checkIn_time: '16:00', status: 'cancelled' }
    ],
    cabs: [
      { date: '2024-07-25', time: '10:00', status: 'confirmed' },
      { date: '2024-07-26', time: '11:00', status: 'draft' }
    ],
    flights: [
      { date: '2024-07-25', time: '08:00', status: 'confirmed' },
      { date: '2024-07-26', time: '09:00', status: 'cancelled' }
    ],
    buses: [
      { date: '2024-07-25', time: '12:00', status: 'confirmed' }
    ],
    trains: []
};

export async function earliestDate(itinerary) {
    try{
        const allowedStatus = [  'draft', 
            'pending approval', 
            'approved', 
            'rejected', 
            'pending booking', 
            'cancelled',
            'paid and cancelled',
            'paid and cancelled',
            'recovered',]
        console.group('tripStartDate before booking')
        console.log("hi i am itinerary",itinerary)
        const dateStrings=Object.entries(itinerary)
            .filter(([category]) => category !== 'formState')
            .flatMap(([category, items]) => {
                const dateFields = {
                    hotels: 'checkIn_date',
                    cabs: 'date',
                    flights: 'date',
                    buses: 'date',
                    trains: 'date'
                };
                const dateField = dateFields[category];
                return items
                    .filter(item => allowedStatus.includes(item.status)  && item[dateField])
                    .map(item => item[dateField]);
            });
    
    const dates = dateStrings.map(dateStr => new Date(dateStr));
    const dateString = dates.length ? new Date(Math.min(...dates)) : null;
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    
    const theDate = dateString ? formatDate(dateString) : null
    console.log("magic", theDate)
    return  theDate

    } catch(error){
        console.error(error)
        throw new Error('Error in finding travel Request Date')
    }
    
};

//   console.log(earliestDate ? earliestDate.toISOString().split('T')[0] : 'No valid dates found');






