// import sgMail from '@sendgrid/mail';
// import dotenv from 'dotenv';

// dotenv.config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const msg = {
//   to: ['sumesh9050@gmail.com',],
//   from: {
//     name:'expenseBook',
//     email: process.env.FROM_EMAIL,
//   },
//   templateId: process.env.TEMPLATE_ID,
//   dynamicTemplateData:{
//     name:'sumesh',
//     code: '40005'
//   }
// };

// const sendMail = async ({name, email, code}) => {
//   try {
//     await sgMail.send({
//       to: [email],
//       from: {
//         name:'expenseBook',
//         email: process.env.FROM_EMAIL,
//       },
//       templateId: process.env.TEMPLATE_ID,
//       dynamicTemplateData:{
//         name,
//         code
//       }
//     });
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);

//     if (error.response) {
//       console.error(error.response.body);
//     }
//   }
// };

// export {sendMail}

import { EmailClient } from '@azure/communication-email'; 
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.EMAIL_API
const client = new EmailClient(connectionString);

async function sendMail({name, email, code}) {
  try{
    const emailMessage = {
      senderAddress: "DoNotReply@0b92c556-0591-4ff8-bfc5-9fa5358b53c0.azurecomm.net",
      content: {
          subject: "Your Temporary Password",
          plainText: `Hello ${name}, \n\nPlease use this OTP to setup your password on Expensebook: ${code}\n\n`,
      },
      recipients: {
          to: [{ address: email }],
      },
  };

  const poller = await client.beginSend(emailMessage);
  const response = await poller.pollUntilDone();

  if (response.status === 'Succeeded') {
      console.log("Email sent successfully!");
  } else {
      console.error("failed to send email.");
      console.log(response);
  }
  }catch(e){
    console.error("failed to send email.");
  }
   
}

export {sendMail}

