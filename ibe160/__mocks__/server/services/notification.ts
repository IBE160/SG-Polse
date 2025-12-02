// ibe160/__mocks__/server/services/notification.ts

export const NotificationService = jest.fn().mockImplementation(() => ({
  sendEmail: jest.fn(async (recipient: string, subject: string, body: string) => {
    if (recipient.includes('notify-fail')) {
      throw new Error('Mock NotificationService email failure');
    }
    // Simulate successful email send
    return Promise.resolve();
  }),
}));
