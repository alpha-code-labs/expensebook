

export async function lastDate(itinerary) {
    try{
        const allowedStatus = [  
            'booked', 
            ]
        console.group('tripCompletionDate before booking')
        console.log("hi i am itinerary",itinerary)
        const dateTimeStrings=Object.entries(itinerary)
            .filter(([category]) => category !== 'formState')
            .flatMap(([category, items]) => {
                const dateFields = {
                    hotels: 'bkd_checkOut_date',
                    cabs: 'bkd_date',
                    flights: 'bkd_date',
                    buses: 'bkd_date',
                    trains: 'bkd_date'
                };

                const timeFields = {
                    hotels: 'bkd_checkOut_time',
                    cabs: 'bkd_time',
                    flights: 'bkd_time',
                    buses: 'bkd_time',
                    trains: 'bkd_time'
                }

                const dateField = dateFields[category];
                const timeField = timeFields[category];
                return items
                    .filter(item => allowedStatus.includes(item.status)  && item[dateField])
                    .map(item => ({
                        date:item[dateField],
                        time:item[timeField],
                    }));
            });
    
            const defaultTime = '00:00'
    const dates = dateTimeStrings.map(({date, time = defaultTime}) => {
        const dateObj = new Date(date)
        const validTime = (time) ? time : defaultTime;
      console.log("what is validTime", validTime)
    const[hours,minutes] = validTime.split(':')
        dateObj.setHours(parseInt(hours),parseInt(minutes),0,0)
        return dateObj
    });

    const dateString = dates.length ? new Date(Math.max(...dates)) : null;
    console.group('tripCompletionDate ', dateString)
    return  dateString

    } catch(error){
        console.error(error)
        throw new Error('Error in finding trip Completion Date')
    }
    
};




