// GoogleMap.js
import React, { useEffect } from 'react';

const GoogleMap = ({ mapRef, inputRef }) => {
  useEffect(() => {
    const loadMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
         // Apply your custom map styles here if any
      });

      const input = inputRef.current;
      const searchBox = new window.google.maps.places.SearchBox(input);

      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
      });

      let markers = [];

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];

        const bounds = new window.google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log('Returned place contains no geometry');
            return;
          }

          const icon = {
            url: place.icon,
            size: new window.google.maps.Size(71, 71),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(17, 34),
            scaledSize: new window.google.maps.Size(25, 25),
          };

          markers.push(
            new window.google.maps.Marker({
              map,
              icon,
              title: place.name,
              position: place.geometry.location,
            })
          );
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    };

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = loadMap;
    document.head.appendChild(script);

    return () => {
      // Cleanup script
      document.head.removeChild(script);
    };
  }, [mapRef, inputRef]);

  return <div ref={mapRef} className="map"></div>;
};

export default GoogleMap;


// import React, { useEffect, useState } from 'react';

// function GoogleMapsSearch({ inputId, onPlaceSelect }) {
//   const [searchBox, setSearchBox] = useState(null);

//   useEffect(() => {
//     // AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg
//     const script = document.createElement('script');
//     // script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&v=weekly`;
//     script.defer = true;
//     script.async = true;

//     script.onload = function () {
//       initSearchBox();
//     };

//     document.head.appendChild(script);

//     return function cleanup() {
//       document.head.removeChild(script);
//     };
//   }, [inputId]);

//   function initSearchBox() {
//     const input = document.getElementById(inputId);
//     const searchBoxInstance = new window.google.maps.places.SearchBox(input);
//     setSearchBox(searchBoxInstance);
//   }

//   useEffect(() => {
//     if (searchBox) {
//       searchBox.addListener('places_changed', function () {
//         const places = searchBox.getPlaces();
//         if (places.length === 0) {
//           return;
//         }

//         const selectedPlace = places[0];
//         onPlaceSelect(selectedPlace);

//         // Get latitude and longitude
//         getLatLng(selectedPlace.formatted_address);
//       });
//     }
//   }, [searchBox, onPlaceSelect]);

//   // Function to get latitude and longitude from address
//   const getLatLng = (address) => {
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ address: address }, (results, status) => {
//       if (status === 'OK' && results.length > 0) {
//         const location = results[0].geometry.location;
//         console.log('Latitude:', location.lat());
//         console.log('Longitude:', location.lng());
//       } else {
//         console.error('Geocode was not successful for the following reason:', status);
//       }
//     });
//   };

//   return null;
// }

// export default GoogleMapsSearch;


// // GoogleMapsSearch.js
// import React, { useEffect, useState } from 'react';

// function GoogleMapsSearch({ inputId, onPlaceSelect }) {
//   const [searchBox, setSearchBox] = useState(null);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&v=weekly`;
//     script.defer = true;
//     script.async = true;

//     script.onload = function () {
//       initSearchBox();
//     };

//     document.head.appendChild(script);

//     return function cleanup() {
//       document.head.removeChild(script);
//     };
//   }, [inputId]);

//   function initSearchBox() {
//     const input = document.getElementById(inputId);
//     const searchBoxInstance = new window.google.maps.places.SearchBox(input);
//     setSearchBox(searchBoxInstance);
//   }

//   useEffect(() => {
//     if (searchBox) {
//       searchBox.addListener('places_changed', function () {
//         const places = searchBox.getPlaces();
//         if (places.length === 0) {
//           return;
//         }

//         const selectedPlace = places[0];
//         onPlaceSelect(selectedPlace);
//       });
//     }
//   }, [searchBox, onPlaceSelect]);

//   return null; // Return null because you don't want to render anything directly in this component
// }

// export default GoogleMapsSearch;

// import React, { useEffect, useState } from 'react';
// import Input from '../components/common/Input';

// const MapWithSearchBox = () => {
//   const [map, setMap] = useState(null);
//   const [searchBox, setSearchBox] = useState(null);
//   const [markers, setMarkers] = useState([]);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&v=weekly`;
//     script.defer = true;
//     script.async = true;

//     script.onload = () => {
//       initMap();
//     };

//     document.head.appendChild(script);

//     return () => {
//       // Clean up the script to avoid memory leaks
//       document.head.removeChild(script);
//     };
//   }, []); // Make sure to replace YOUR_API_KEY with your actual Google Maps API key

//   const initMap = () => {
//     const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
//       center: { lat: -33.8688, lng: 151.2195 },
//       zoom: 13,
//       mapTypeId: 'roadmap',
//     });

//     setMap(mapInstance);

//     const input = document.getElementById('pac-input');
//     const searchBoxInstance = new window.google.maps.places.SearchBox(input);
//     setSearchBox(searchBoxInstance);

//     mapInstance.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

//     mapInstance.addListener('bounds_changed', () => {
//       searchBoxInstance.setBounds(mapInstance.getBounds());
//     });

//     searchBoxInstance.addListener('places_changed', () => {
//       const places = searchBoxInstance.getPlaces();

//       if (places.length === 0) {
//         return;
//       }

//       // Clear out the old markers.
//       markers.forEach((marker) => {
//         marker.setMap(null);
//       });
//       setMarkers([]);

//       const bounds = new window.google.maps.LatLngBounds();

//       places.forEach((place) => {
//         if (!place.geometry || !place.geometry.location) {
//           console.log('Returned place contains no geometry');
//           return;
//         }

//         const icon = {
//           url: place.icon,
//           size: new window.google.maps.Size(71, 71),
//           origin: new window.google.maps.Point(0, 0),
//           anchor: new window.google.maps.Point(17, 34),
//           scaledSize: new window.google.maps.Size(25, 25),
//         };

//         const marker = new window.google.maps.Marker({
//           map: mapInstance,
//           icon,
//           title: place.name,
//           position: place.geometry.location,
//         });

//         setMarkers((prevMarkers) => [...prevMarkers, marker]);

//         if (place.geometry.viewport) {
//           bounds.union(place.geometry.viewport);
//         } else {
//           bounds.extend(place.geometry.location);
//         }
//       });

//       mapInstance.fitBounds(bounds);
//     });
//   };

//   return (
    
//     <div>
//       <Input
//        id="pac-input" 
//        className="controls" 
//        type="text" 
//        placeholder="Search Box" />
//       <div id="map"></div>
//     </div>
//   );
// };

// export default MapWithSearchBox;




// import React, { useEffect, useState } from 'react';

// const MapWithSearchBox = () => {
//   const [map, setMap] = useState(null);
//   const [searchBox, setSearchBox] = useState(null);
//   const [markers, setMarkers] = useState([]);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&v=weekly`;
//     script.defer = true;
//     script.async = true;

//     script.onload = () => {
//       initMap();
//     };

//     document.head.appendChild(script);

//     return () => {
//       // Clean up the script to avoid memory leaks
//       document.head.removeChild(script);
//     };
//   }, []); // Make sure to replace YOUR_API_KEY with your actual Google Maps API key

//   const initMap = () => {
//     const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
//       center: { lat: -33.8688, lng: 151.2195 },
//       zoom: 13,
//       mapTypeId: 'roadmap',
//     });

//     setMap(mapInstance);

//     const input = document.getElementById('pac-input');
//     const searchBoxInstance = new window.google.maps.places.SearchBox(input);
//     setSearchBox(searchBoxInstance);

//     mapInstance.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

//     mapInstance.addListener('bounds_changed', () => {
//       searchBoxInstance.setBounds(mapInstance.getBounds());
//     });

//     searchBoxInstance.addListener('places_changed', () => {
//       const places = searchBoxInstance.getPlaces();

//       if (places.length === 0) {
//         return;
//       }

//       // Clear out the old markers.
//       markers.forEach((marker) => {
//         marker.setMap(null);
//       });
//       setMarkers([]);

//       const bounds = new window.google.maps.LatLngBounds();

//       places.forEach((place) => {
//         if (!place.geometry || !place.geometry.location) {
//           console.log('Returned place contains no geometry');
//           return;
//         }
      
//         const icon = {
//           url: place.icon,
//           size: new window.google.maps.Size(71, 71),
//           origin: new window.google.maps.Point(0, 0),
//           anchor: new window.google.maps.Point(17, 34),
//           scaledSize: new window.google.maps.Size(25, 25),
//         };
      
//         const city = place.address_components.find((component) =>
//           component.types.includes('locality')
//         );
      
//         const marker = new window.google.maps.Marker({
//           map: mapInstance,
//           icon,
//           title: city ? city.long_name : place.name,
//           position: place.geometry.location,
//         });
      
//         setMarkers((prevMarkers) => [...prevMarkers, marker]);
      
//         if (place.geometry.viewport) {
//           bounds.union(place.geometry.viewport);
//         } else {
//           bounds.extend(place.geometry.location);
//         }
//       });

//       mapInstance.fitBounds(bounds);
//     });
//   };

//   return (
//     <div>
//       <input id="pac-input" className="controls" type="text" placeholder="Search Box" />
//       {/* <div id="map"></div> */}
//     </div>
//   );
// };

// export default MapWithSearchBox;








///------------------------------top notch---------------------------------------------------------
// this is free to get city details
// import React, { useState, useEffect } from 'react';

// const LocationLookup = () => {
//   const [cityName, setCityName] = useState('');
//   const [citySuggestions, setCitySuggestions] = useState([]);

//   useEffect(() => {
//     if (cityName.length >= 3) {
//       fetchCitySuggestions(cityName);
//     } else {
//       setCitySuggestions([]);
//     }
//   }, [cityName]);

//   const fetchCitySuggestions = async (query) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
//       );
//       const data = await response.json();
//       const suggestions = data.map((result) => result.display_name);
//       setCitySuggestions(suggestions);
//     } catch (error) {
//       console.error('Error fetching city suggestions:', error);
//       setCitySuggestions([]);
//     }
//   };

//   const handleCityChange = (event) => {
//     setCityName(event.target.value);
//   };

//   const handleSelectCity = (selectedCity) => {
//     setCityName(selectedCity);
//     setCitySuggestions([]);
//   };

//   const handleCityLookup = () => {
//     // Implement the existing functionality (geolocation lookup) here
//     // ...

//     // For demonstration purposes, we'll set the city directly
//     setCityName('Selected city from geolocation');
//   };

//   return (
//     <div>
//       <h2>Location Lookup</h2>
//       <label htmlFor="cityInput">Enter City Name:</label>
//       <input
//         type="text"
//         id="cityInput"
//         value={cityName}
//         onChange={handleCityChange}
//       />
//       {citySuggestions.length > 0 && (
//         <ul>
//           {citySuggestions.map((suggestion) => (
//             <li
//               key={suggestion}
//               onClick={() => handleSelectCity(suggestion)}
//             >
//               {suggestion}
//             </li>
//           ))}
//         </ul>
//       )}
//       <button onClick={handleCityLookup}>Lookup City</button>
//       <div>
//         <strong>City Name:</strong> {cityName}
//       </div>
//     </div>
//   );
// };

// export default LocationLookup;



// import React, { useState } from 'react';

// const LocationLookup = () => {
//   const [cityName, setCityName] = useState('');

//   const handleCityLookup = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;

//           try {
//             const response = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//             );
//             const data = await response.json();
//             const city = data.address.city || data.address.village || 'City not found';
//             setCityName(city);
//           } catch (error) {
//             console.error('Error fetching city:', error);
//             setCityName('Error fetching city');
//           }
//         },
//         (error) => {
//           console.error('Error getting geolocation:', error);
//           setCityName('Error getting geolocation');
//         }
//       );
//     } else {
//       console.error('Geolocation is not supported by this browser');
//       setCityName('Geolocation not supported');
//     }
//   };

//   return (
//     <div>
//       <h2>Location Lookup</h2>
//       <label htmlFor="cityInput">Enter City Name:</label>
//       <input
//         type="text"
//         id="cityInput"
//         value={cityName}
//         onChange={(e) => setCityName(e.target.value)}
//       />
//       <button onClick={handleCityLookup}>Lookup City</button>
//       <div>
//         <strong>City Name:</strong> {cityName}
//       </div>
//     </div>
//   );
// };

// export default LocationLookup;


// // import React, { useState, useEffect } from 'react';
// // import { MapContainer, TileLayer, useMap } from 'react-leaflet';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';

// // const apiKey = 'YOUR_OPENCAGE_API_KEY'; // Replace with your OpenCage API key

// // // Function to get the user's geolocation
// // const getUserLocation = () => {
// //   return new Promise((resolve, reject) => {
// //     navigator.geolocation.getCurrentPosition(
// //       (position) => resolve(position.coords),
// //       (error) => reject(error)
// //     );
// //   });
// // };

// // // Function to perform reverse geocoding using OpenCage API
// // const reverseGeocode = async (latitude, longitude) => {
// //   const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&pretty=1`;

// //   try {
// //     const response = await fetch(apiUrl);
// //     const data = await response.json();
// //     const city = data.results[0].components.city;
// //     return city;
// //   } catch (error) {
// //     console.error('Error during reverse geocoding:', error);
// //     return null;
// //   }
// // };

// // const LocationMap = () => {
// //   const [cityName, setCityName] = useState(null);

// //   useEffect(() => {
// //     const fetchUserLocation = async () => {
// //       try {
// //         const coords = await getUserLocation();
// //         const city = await reverseGeocode(coords.latitude, coords.longitude);
// //         setCityName(city);
// //       } catch (error) {
// //         console.error('Error fetching user location:', error);
// //       }
// //     };

// //     fetchUserLocation();
// //   }, []);

// //   const LocationMarker = () => {
// //     const map = useMap();
// //     const markerIcon = new L.Icon({
// //       iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
// //       shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
// //       iconSize: [25, 41],
// //       iconAnchor: [12, 41],
// //       popupAnchor: [1, -34],
// //       shadowSize: [41, 41],
// //     });

// //     map.locate({ setView: true, maxZoom: 13 });

// //     map.on('locationfound', (e) => {
// //       const marker = L.marker(e.latlng, { icon: markerIcon }).addTo(map);
// //       marker.bindPopup(`You are in ${cityName}`).openPopup();
// //     });

// //     return null;
// //   };

// //   return (
// //     <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
// //       <TileLayer
// //         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //       />
// //       {cityName && <LocationMarker />}
// //     </MapContainer>
// //   );
// // };

// // export default LocationMap;




// // import React, { useState, useEffect } from 'react';
// // import airportCodes from 'airport-codes';

// // const AirportLookup = () => {
// //   const [cityName, setCityName] = useState('');
// //   const [airportName, setAirportName] = useState('');
// //   const [citySuggestions, setCitySuggestions] = useState([]);
  

// // const allCityNames = airportCodes.map((airport) => airport.get('city'));

// // console.log('All City Names:', allCityNames);


// //   useEffect(() => {
// //     if (cityName.length > 3) {
// //       const suggestions = airportCodes.filter(
// //         (airport) =>
// //           airport.get('city').toLowerCase().startsWith(cityName.toLowerCase())
// //       );
// //       setCitySuggestions(suggestions);
// //     } else {
// //       setCitySuggestions([]);
// //     }
// //   }, [cityName]);

// //   const handleCityChange = (event) => {
// //     setCityName(event.target.value);
// //   };

// //   const handleSelectCity = (selectedCity) => {
// //     setCityName(selectedCity);
// //     setCitySuggestions([]);
// //   };

// //   const handleLookup = () => {
// //     const airportData = airportCodes.findWhere({ city: cityName });

// //     if (airportData) {
// //       setAirportName(airportData.get('name'));
// //     } else {
// //       setAirportName('Airport not found');
// //     }
// //   };


// //   return (
// //     <div>
// //       <h2>Airport Lookup</h2>
// //       <label htmlFor="cityInput">Enter City Name:</label>
// //       <input
// //         type="text"
// //         id="cityInput"
// //         value={cityName}
// //         onChange={handleCityChange}
// //       />
// //       {citySuggestions.length > 0 && (
// //         <ul>
// //           {citySuggestions.map((suggestion) => (
// //             <li key={suggestion.get('city')} onClick={() => handleSelectCity(suggestion.get('city'))}>
// //               {suggestion.get('city')}
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //       <button onClick={handleLookup}>Lookup Airport</button>
// //       <div>
// //         <strong>Airport Name:</strong> {airportName}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AirportLookup;
