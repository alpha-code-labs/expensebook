// Function to convert degrees to radians
const degreesToRadians = async(degrees) => {
    return await degrees * (Math.PI / 180);
};

// Function to calculate Haversine distance
export const calculateHaversineDistance = async (lat1, lon1, lat2, lon2) => {
    return new Promise(async (resolve, reject) => {
        try {
            const R = 6371; // Radius of the Earth in kilometers
            const dLat = await degreesToRadians(lat2 - lat1);
            const dLon = await degreesToRadians(lon2 - lon1);

            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const distance = R * c; // Distance in kilometers

            resolve(distance);
        } catch (error) {
            reject(error);
        }
    });
};


// // Function to convert degrees to radians
// const degreesToRadians = (degrees) => {
//     return degrees * (Math.PI / 180);
// };

// // Function to calculate Haversine distance
// export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = degreesToRadians(lat2 - lat1);
//     const dLon = degreesToRadians(lon2 - lon1);

//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     const distance = R * c; // Distance in kilometers

//     return distance;
// };

// // check /km rate 10rs /km , personal 