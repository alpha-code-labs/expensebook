import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: ['sumesh9050@gmail.com',],
  from: {
    name:'expenseBook',
    email: process.env.FROM_EMAIL,
  },
  templateId: process.env.TEMPLATE_ID,
  dynamicTemplateData:{
    name:'sumesh',
    code: '40005'
  }
};

const sendMail = async ({name, email, code}) => {
  try {
    await sgMail.send({
      to: [email],
      from: {
        name:'expenseBook',
        email: process.env.FROM_EMAIL,
      },
      templateId: process.env.TEMPLATE_ID,
      dynamicTemplateData:{
        name,
        code
      }
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

export {sendMail}


