import React, { useState, useEffect } from 'react';

const Page_2 = () => {
  // State to hold the name
  const [name, setName] = useState('');

  useEffect(() => {
    // Retrieve the name from localStorage when the component mounts
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      setName(storedName);
    }
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount

  const handleNameChange = (event) => {
    // Update the name in state
    setName(event.target.value);
  };

  const saveNameToLocalStorage = () => {
    // Save the name to localStorage
    localStorage.setItem('user_name', name);
  };

  const consoleLogStoredName = () => {
    // Retrieve the name from localStorage and console log it
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      console.log('Name from localStorage:', storedName);
    } else {
      console.log('Name not found in localStorage.');
    }
  };

  return (
    <div>
      <label>
        Enter your name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <button onClick={saveNameToLocalStorage}>Save Name</button>
      <button onClick={consoleLogStoredName}>Console Log Stored Name</button>
    </div>
  );
};

export default Page_2;

