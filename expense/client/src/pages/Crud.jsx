// import React, { useState, useRef, useEffect } from 'react';
// import Input from '../components/common/Input';

// const Crud = () => {
//   const reimbursementCategories = [
//     {
//       categoryName: 'Office Supplies',
//       fields: [
//         { name: 'Bill Date', type: 'date' },
//         { name: 'DropOff', type: 'numeric' },
//         { name: 'PickUp', type: 'text' },
//         { name: 'Description', type: 'text' },
//         { name: 'Quantity', type: 'numeric' },
//         { name: 'Unit Cost', type: 'numeric' },
//         { name: 'Tax Amount', type: 'numeric' },
//         { name: 'Total Amount', type: 'numeric' },
//       ],
//     },
//     {
//       categoryName: 'Travel Expenses',
//       fields: [
//         { name: 'Bill Date', type: 'date' },
//         { name: 'Bill Number', type: 'numeric' },
//         { name: 'Description', type: 'text' },
//         { name: 'Quantity', type: 'numeric' },
//         { name: 'Unit Cost', type: 'numeric' },
//         { name: 'Total Amount', type: 'numeric' },
//       ],
//     },
//   ];

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [categoryFields, setCategoryFields] = useState([]);
//   const autocompleteRefs = {};

//   const initialFormValues = Object.fromEntries(categoryFields.map((field) => [field.name, '']));
//   const [formValues, setFormValues] = useState(initialFormValues);

//   const handleChange = (name, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };

//   const handlePlaceSelect = (name, place) => {
//     const formattedAddress = place.formatted_address;

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: formattedAddress,
//     }));
//   };

//   const initAutocomplete = (name) => {
//     const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRefs[name].current);

//     autocomplete.addListener('place_changed', () => {
//       const place = autocomplete.getPlace();
//       handlePlaceSelect(name, place);
//     });
//   };

//   const loadGoogleMapsScript = async () => {
//     console.log('Checking Google API load...');

//     if (!window.google) {
//       console.log('Google API not found, loading...');

//       const loadScript = () => {
//         return new Promise((resolve, reject) => {
//           const script = document.createElement('script');
//           script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
//           script.defer = true;
//           script.async = true;
//           script.onload = resolve;
//           script.onerror = reject;
//           document.head.appendChild(script);
//         });
//       };

//       try {
//         await loadScript();
//         console.log('Google API loaded successfully');

//         // Initialize Autocomplete for specified fields
//         if (name === 'PickUp' || name === 'DropOff') {
//           const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRefs[name].current);
      
//           autocomplete.addListener('place_changed', () => {
//             const place = autocomplete.getPlace();
//             handlePlaceSelect(name, place);
//           });
//         }
//       } catch (error) {
//         console.error('Error loading Google Maps script:', error);
//       }
//     } else {
//       console.log('Google API already loaded');
//     }
//   };

//   useEffect(() => {
//     loadGoogleMapsScript();
//   }, []); // Include categoryFields as a dependency

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//     setCategoryFields(category.fields);
//     setFormValues(initialFormValues);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log('Selected Category:', selectedCategory);
//     console.log('Form Values:', formValues);
//     // Add logic to handle form submission based on the selected category
//   };

//   return (
//     <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Select Category</label>
//         <select
//           onChange={(e) => handleCategoryChange(reimbursementCategories.find((category) => category.categoryName === e.target.value))}
//           value={selectedCategory ? selectedCategory.categoryName : ''}
//           className="w-full bg-white border border-gray-300 p-2 rounded"
//         >
//           <option value="">Select Category</option>
//           {reimbursementCategories.map((category) => (
//             <option key={category.categoryName} value={category.categoryName}>
//               {category.categoryName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {categoryFields.map((field) => (
//         <div key={field.name} className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">{field.name}</label>
//           <Input
//             title={field.name}
//             type={field.type === 'numeric' ? 'number' : 'text'}
//             placeholder={field.name}
//             onChange={(value) => handleChange(field.name, value)}
//             initialValue={formValues[field.name]}
//             inputRef={(ref) => (autocompleteRefs[field.name] = ref)}
//             error={{ set: false, msg: '' }}
//           />
//         </div>
//       ))}

//       <button
//         type="submit"
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };

// export default Crud;


import React, { useState, useRef, useEffect } from 'react';
import Input from '../components/common/Input';


const Crud = () => {
 const  reimbursementCategories = [
    {
      categoryName: 'Office Supplies',
     
      fields: [
        { name:'Bill Date',type:'date'},
        { name:'Bill Number',type:'numeric'},
        { name:'PickUp',type:'text'},
        { name: 'Description', type: 'text' },
        { name: 'Quantity', type: 'numeric' },
        { name: 'Unit Cost', type: 'numeric' },
        { name: 'Tax Amount', type: 'numeric' },
        { name: 'Total Amount', type: 'numeric' },      
      ]
    },
    {
      categoryName: 'Travel Expenses',   
        fields: [
          { name:'Bill Date',type:'date'},
          { name:'Bill Number',type:'numeric'},
          { name: 'Description', type: 'text' },
          { name: 'Quantity', type: 'numeric' },
          { name: 'Unit Cost', type: 'numeric' },
          { name: 'Total Amount', type: 'numeric' },      
        ]     
    },
  ]

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFields, setCategoryFields] = useState([]);
  const autocompleteRefs = useRef({});

  const initialFormValues = Object.fromEntries(categoryFields.map((field) => [field.name, '']));
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handlePlaceSelect = (name, place) => {
    const formattedAddress = place.formatted_address;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: formattedAddress,
    }));
  };

  const initAutocomplete = (name) => {
    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRefs[name].current);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      handlePlaceSelect(name, place);
    });
  };
  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      console.log('Checking Google API load...');
      
      if (!window.google) {
        console.log('Google API not found, loading...');
        
        const loadScript = () => {
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
            script.defer = true;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        };
    
        try {
          await loadScript();
          console.log('Google API loaded successfully');
          
          // Initialize Autocomplete for specified fields
          categoryFields.forEach((field) => {
            if (field.name === 'PickUp' || field.name === 'DropOff') {
              initAutocomplete(field.name);
            }
          });
        } catch (error) {
          console.error('Error loading Google Maps script:', error);
        }
      } else {
        console.log('Google API already loaded');
      }
    };

    loadGoogleMapsScript();
  }, [categoryFields]);

  // const loadGoogleMapsScript = async () => {
  //       console.log('Checking Google API load...');
        
  //       if (!window.google) {
  //         console.log('Google API not found, loading...');
          
  //         const loadScript = () => {
  //           return new Promise((resolve, reject) => {
  //             const script = document.createElement('script');
  //             script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
  //             script.defer = true;
  //             script.async = true;
  //             script.onload = resolve;
  //             script.onerror = reject;
  //             document.head.appendChild(script);
  //           });
  //         };
      
  //         try {
  //           await loadScript();
  //           console.log('Google API loaded successfully');
            
  //           // Initialize Autocomplete for specified fields
  //           categoryFields.forEach((field) => {
  //             if (field.name === 'PickUp' || field.name === 'DropOff') {
  //               initAutocomplete(field.name);
  //             }
  //           });
  //         } catch (error) {
  //           console.error('Error loading Google Maps script:', error);
  //         }
  //       } else {
  //         console.log('Google API already loaded');
  //       }
  //     };
        
  //     useEffect(() => {
  //       loadGoogleMapsScript();
  //     }, []);

 



  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCategoryFields(category.fields);
    setFormValues(initialFormValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Selected Category:', selectedCategory);
    console.log('Form Values:', formValues);
    // Add logic to handle form submission based on the selected category
  };

  return (
    <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Category</label>
        <select
          onChange={(e) => handleCategoryChange(reimbursementCategories.find(category => category.categoryName === e.target.value))}
          value={selectedCategory ? selectedCategory.categoryName : ''}
          className="w-full bg-white border border-gray-300 p-2 rounded"
        >
          <option value="">Select Category</option>
          {reimbursementCategories.map((category) => (
            <option key={category.categoryName} value={category.categoryName}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>

      {categoryFields.map((field) => (
  <div key={field.name} className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">{field.name}</label>
    <Input
      title={field.name}
      type={field.type === 'numeric' ? 'number' : 'text'}
      placeholder={field.name}
      onChange={(value) => handleChange(field.name, value)}
      initialValue={formValues[field.name]}
      inputRef={autocompleteRefs[field.name] || (autocompleteRefs[field.name] = useRef())} // Pass the appropriate ref here
      error={{ set: false, msg: '' }}
    />
  </div>
))}


      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default Crud;


// import React, { useState, useRef, useEffect } from 'react';
// import Input from '../components/common/Input';
// const Crud = () => {
//   const formFields = [
//     { name: 'Bill Date', type: 'date' },
//     { name: 'Bill Number', type: 'numeric' },
//     { name: 'PickUp', type: 'text' },
//     { name: 'DropOff', type: 'text' },
//     { name: 'City', type: 'text' },
//     { name: 'Quantity', type: 'numeric' },
//     { name: 'Unit Cost', type: 'numeric' },
//     { name: 'Tax Amount', type: 'numeric' },
//     { name: 'Total Amount', type: 'numeric' },
//   ];

//   const autocompleteRefs = {};

//   const initialFormValues = Object.fromEntries(formFields.map((field) => [field.name, '']));
//   const [formValues, setFormValues] = useState(initialFormValues);

//   const handleChange = (name, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };

//   const handlePlaceSelect = (name, place) => {
//     const formattedAddress = place.formatted_address;

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: formattedAddress,
//     }));
//   };

//   const initAutocomplete = (name) => {
//     const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRefs[name].current);

//     autocomplete.addListener('place_changed', () => {
//       const place = autocomplete.getPlace();
//       handlePlaceSelect(name, place);
//     });
//   };
//   const loadGoogleMapsScript = async () => {
//     console.log('Checking Google API load...');
    
//     if (!window.google) {
//       console.log('Google API not found, loading...');
      
//       const loadScript = () => {
//         return new Promise((resolve, reject) => {
//           const script = document.createElement('script');
//           script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
//           script.defer = true;
//           script.async = true;
//           script.onload = resolve;
//           script.onerror = reject;
//           document.head.appendChild(script);
//         });
//       };
  
//       try {
//         await loadScript();
//         console.log('Google API loaded successfully');
        
//         // Initialize Autocomplete for specified fields
//         formFields.forEach((field) => {
//           if (field.name === 'PickUp' || field.name === 'DropOff') {
//             initAutocomplete(field.name);
//           }
//         });
//       } catch (error) {
//         console.error('Error loading Google Maps script:', error);
//       }
//     } else {
//       console.log('Google API already loaded');
//     }
//   };
    
//   useEffect(() => {
//     loadGoogleMapsScript();
//   }, []);
  


  
//   const handleSubmit = (e) => {
//     e.preventDefault(); // Add this line to prevent the default form submission behavior
  
//     console.log("handle submit AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries", formValues);
//   }

//   return (
//     <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
//       {formFields.map((field) => (
//         <div key={field.name} className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             {field.name}
//           </label>
//           <Input
//   title={field.name}
//   type={field.type === 'numeric' ? 'number' : 'text'}
//   placeholder={field.name}
//   onChange={(value) => handleChange(field.name, value)}
//   initialValue={formValues[field.name]}
//   inputRef={autocompleteRefs[field.name] || (autocompleteRefs[field.name] = useRef())}
//   error={{ set: false, msg: '' }} // You can pass the actual error object if needed
// />
//         </div>
//       ))}
//       <button
//         type="submit"
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };

// export default Crud;

