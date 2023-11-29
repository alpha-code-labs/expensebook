import sgMail from '@sendgrid/mail'

// Set your SendGrid API key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

/**
 * Sends an email using SendGrid.
 * @param {Object} emailData - The email data object.
 * @param {string} emailData.to - The recipient's email address.
 * @param {string} emailData.subject - The subject of the email.
 * @param {string} emailData.text - The plain text content of the email.
 * @param {string} [emailData.from] - The sender's email address (optional, defaults to a predefined value or your SendGrid account's default sender).
 * @returns {Promise} A promise that resolves when the email is sent successfully or rejects if there is an error.
 */
async function sendEmail(emailData) {
  // Destructure the emailData object
  const { to, subject, text, from } = emailData;

  // Create the message object
  const msg = {
    to,
    from: from || 'default-sender@example.com', // You can replace this with your default sender or use the provided 'from' value
    subject,
    text,
  };

  try {
    // Send the email
    await sgMail.send(msg);
    console.log('Email sent successfully');
    return true; // Indicate success
  } catch (error) {
    console.error('Error sending email:', error.message || error);
    throw new Error('Failed to send email');
  }
}

// Example usage:
const emailData = {
  to: 'ajayaxes318@gmail.com',
  subject: 'Test Email',
  text: 'This is a test email.',
};

sendEmail(emailData)
  .then((success) => {
    if (success) {
      console.log('Email sent successfully!');
    } else {
      console.log('Email sending failed.');
    }
  })
  .catch((error) => {
    console.error('Error:', error.message || error);
  });
