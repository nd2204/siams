export type SendEmailRequest = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface IEmailService {
  sendMail({ to, subject, html, text }: SendEmailRequest): Promise<void>
}
