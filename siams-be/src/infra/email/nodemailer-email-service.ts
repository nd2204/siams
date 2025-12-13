import nodemailer, { Transporter } from "nodemailer";
import { IEmailService, SendEmailRequest } from "@domain/services/email-service";
import { IAppConfig } from "@domain/interfaces/config";

export class NodemailerEmailService implements IEmailService {
  private transporter: Transporter;

  constructor(private readonly config: IAppConfig["email"]) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });
  }

  async sendMail({ to, subject, html, text }: SendEmailRequest): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.from,
      to,
      subject,
      html,
      text
    });
  }
}
