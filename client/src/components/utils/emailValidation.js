export function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email) {
      return 'Email is required.';
    } else if (!emailPattern.test(email)) {
      return 'Invalid email format.';
    }
  
    return ''; // Return an empty string if the email is valid
  }
  
  