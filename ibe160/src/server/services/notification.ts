// src/server/services/notification.ts

import { Resend } from 'resend';
import { env } from '~/env'; // Assuming RESEND_API_KEY is in env

export class NotificationService {
  private resend: Resend;

  constructor() {
    // TODO: Validate env.RESEND_API_KEY exists
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  /**
   * Sends an email notification.
   * @param recipient The email address of the recipient (e.g., teacher).
   * @param subject The subject line of the email.
   * @param body The HTML content of the email.
   */
  public async sendEmail(recipient: string, subject: string, body: string): Promise<void> {
    try {
      // TODO: Define a proper 'from' email address (e.g., a verified domain)
      const { data, error } = await this.resend.emails.send({
        from: 'onboarding@resend.dev', // Placeholder: Replace with a verified sender email
        to: recipient,
        subject: subject,
        html: body,
      });

      if (error) {
        console.error('Failed to send email:', error);
        throw new Error(`Resend email error: ${error.message}`);
      }

      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error(`Error in sendEmail to ${recipient}:`, error);
      throw error; // Re-throw to be handled by the caller (e.g., webhook)
    }
  }

  // Potentially other notification methods (e.g., in-app message, SMS) can be added here
}
