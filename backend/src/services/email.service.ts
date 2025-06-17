import dotenv from "dotenv";
import nodemailer, { Transporter } from "nodemailer";
import { verifyWelcomeEmail } from "../templates/email/welcome-email.template";
import { manageInvitationEmailTemplate, manageInvitationWithNewUser, recordatioEmailTemplate } from "../templates/email";

dotenv.config();

export class EmailService {
  private transporter: Transporter;
  private defaultFrom: string;
  constructor() {
    // Verificar que las variables de entorno estén definidas
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_PORT ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      console.error(
        "Error: Las variables de entorno de Nodemailer no están configuradas."
      );
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
      },
    });

    this.defaultFrom = process.env.EMAIL_USER!;
  }

  /**
   * Envía un correo electrónico de bienvenida al usuario con un enlace
   * de verificación de email.
   *
   * @param email - Email del usuario.
   * @param nickname - Nickname del usuario.
   * @param url - URL de verificación de email.
   * @returns Booleano indicando si se ha enviado el correo exitosamente.
   */
  public async sendWelcomeVerificationEmail(
    email: string,
    nickname: string,
    url: string
  ): Promise<boolean> {
    const mailOptions = {
      from: this.defaultFrom, // Usa el remitente proporcionado o el por defecto
      to: email,
      subject: `👋 ${nickname} bienvenido a NIDO`,
      html: verifyWelcomeEmail(nickname, url),
    };

    try {
      const response = await this.transporter.sendMail(mailOptions);
      console.log(response);
      if (response.messageId) {
        console.log("Correo enviado exitosamente");
        return true;
      } else {
        console.error("Error al enviar el correo");
        return false;
      }
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      return false;
    }
  }
  /**
   * Envía un correo electrónico de invitación a un usuario con un enlace
   * para unirse a una familia.
   *
   * @param email - Email del usuario.
   * @param nickname - Nickname del usuario.
   * @param url - URL de invitación.
   * @param familyName - Nombre de la familia.
   * @param userIsRegistered - Indica si el usuario ya está registrado.
   * @returns Booleano indicando si se ha enviado el correo exitosamente.
   */
  public async sendInvitationEmailToUser(
    email: string,
    nickname: string,
    url: string,
    familyName: string,
    userIsRegistered: boolean
  ): Promise<boolean> {
    const mailOptions = {
      from: this.defaultFrom, // Usa el remitente proporcionado o el por defecto
      to: email,
      subject: `✍️ Invitación para unirse a la familia ${familyName}`,
      html: userIsRegistered
        ? manageInvitationEmailTemplate(familyName, nickname, url)
        : manageInvitationWithNewUser(familyName, nickname, url),
    };

    try {
      const response = await this.transporter.sendMail(mailOptions);
      console.log(response);
      if (response.messageId) {
        console.log("Correo enviado exitosamente");
        return true;
      } else {
        console.error("Error al enviar el correo");
        return false;
      }
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      return false;
    }
  }

  /**
   * Envía un correo electrónico de recordatorio a un usuario con un enlace
   * para acceder a una actividad.
   *
   * @param email - Email del usuario.
   * @param nickname - Nickname del usuario.
   * @param title - Título de la actividad.
   * @param url - URL de la actividad.
   * @returns Booleano indicando si se ha enviado el correo exitosamente.
   */
  async sendRecordatorio(email: string, nickname: string, title:string, url: string) {
    const mailOptions = {
      from: this.defaultFrom, 
      to: email,
      subject: `🔔 ${nickname} recordatorio de NIDO`,
      html: recordatioEmailTemplate(nickname, title, url)
    };

    try {
      const response = await this.transporter.sendMail(mailOptions);
      console.log(response);
      if (response.messageId) {
        console.log("Correo enviado exitosamente");
        return true;
      } else {
        console.error("Error al enviar el correo");
        return false;
      }
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      return false;
    }
  }

}
