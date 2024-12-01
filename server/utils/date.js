export async function earliestDate(itinerary, addStatus) {
  try {
    const allowedStatus = [
      "draft",
      "pending approval",
      "approved",
      "rejected",
      "pending booking",
      "cancelled",
      "paid and cancelled",
      "recovered",
    ];

    if (Array.isArray(addStatus) && addStatus.length > 0) {
      allowedStatus.push(...addStatus);
    }

    const dateStrings = Object.entries(itinerary).flatMap(
      ([category, items]) => {
        const dateFields = {
          hotels: "checkIn_date",
          cabs: "date",
          flights: "date",
          buses: "date",
          trains: "date",
        };
        const dateField = dateFields[category];
        return items
          .filter(
            (item) => allowedStatus.includes(item.status) && item[dateField]
          )
          .map((item) => item[dateField]);
      }
    );

    const dates = dateStrings.map((dateStr) => new Date(dateStr));
    const dateString = dates.length ? new Date(Math.min(...dates)) : null;
    return dateString;
  } catch (error) {
    console.error(error);
    throw new Error("Error in finding travel Request Date");
  }
}

//console.log(earliestDate ? earliestDate.toISOString().split('T')[0] : 'No valid dates found');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// const theDate = dateString ? formatDate(dateString) : null
// console.log("magic", theDate)

export function extractStartDate(itinerary) {
  try {
    const allowedStatus = [
      "draft",
      "pending approval",
      "approved",
      "rejected",
      "pending booking",
      "cancelled",
      "paid and cancelled",
      "recovered",
    ];

    const dateStrings = Object.entries(itinerary)
      // .filter(([category]) => category !== 'formState')
      .flatMap(([category, items]) => {
        const dateFields = {
          hotels: "checkIn_date",
          cabs: "date",
          flights: "date",
          buses: "date",
          trains: "date",
        };
        const dateField = dateFields[category];
        return items
          .filter(
            (item) => allowedStatus.includes(item.status) && item[dateField]
          )
          .map((item) => item[dateField]);
      });

    const dates = dateStrings.map((dateStr) => new Date(dateStr));
    const dateString = dates.length ? new Date(Math.min(...dates)) : null;
    return dateString;
  } catch (error) {
    console.error(error);
    throw new Error("Error in finding travel Request Date");
  }
}
