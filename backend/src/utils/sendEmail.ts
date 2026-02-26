import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Si no hay credenciales configuradas, deshabilitamos el envío real de correos
// y usamos un transporter "dummy" que solo loguea el intento de envío.
const hasEmailCredentials =
  !!process.env.EMAIL_TO_SEND_EMAIL && !!process.env.PASSWORD_TO_SEND_EMAIL;

const transporter = hasEmailCredentials
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_TO_SEND_EMAIL,
        pass: process.env.PASSWORD_TO_SEND_EMAIL,
      },
    })
  : {
      sendMail: async (options: any) => {
        console.log(
          '[sendEmail] Email sending is disabled (no SMTP credentials).',
          {
            to: options?.to,
            subject: options?.subject,
          }
        );
        return Promise.resolve();
      },
    } as unknown as nodemailer.Transporter;

export { transporter };
