import dotenv from 'dotenv';
import nodemailer, { Transporter } from 'nodemailer';
import { verifyWelcomeEmail } from '../templates/email/welcome-email.template';


dotenv.config();

export class EmailService { 
    private transporter: Transporter;
    private defaultFrom: string;
      constructor() {
    // Verificar que las variables de entorno estén definidas
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Error: Las variables de entorno de Nodemailer no están configuradas.');
    }

    // Configuración del transportador de Nodemailer
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT!, 
      pool: true,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    this.defaultFrom = process.env.EMAIL_USER!; 
  }

  public async sendWelcomeVerificationEmail(email: string, nickname: string, url: string):Promise<boolean> {
    const mailOptions = {
        from:  this.defaultFrom, // Usa el remitente proporcionado o el por defecto
        to: email,
        subject: `👋 ${nickname} bienvenido a NIDO`,
        html: verifyWelcomeEmail(nickname, url),
      };

      try {
        const response = await this.transporter.sendMail(mailOptions);
        console.log(response);
        if (response.messageId) {
          console.log('Correo enviado exitosamente');
          return true;
        } else {
          console.error('Error al enviar el correo');
          return false;
        }
      } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false;
      }

   }


}