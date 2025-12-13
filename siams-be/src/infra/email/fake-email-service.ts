import { IEmailService } from "@domain/services/email-service";

export class FakeEmailService implements IEmailService {
  sent: any[] = [];

  async sendMail(options: any): Promise<void> {
    this.sent.push(options);
  }
}
