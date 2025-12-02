// ibe160/__mocks__/resend.ts

export const Resend = jest.fn(() => ({
  emails: {
    send: jest.fn(({ to, subject, html }: { to: string; subject: string; html: string }) => {
      if (to.includes('fail@example.com')) {
        return Promise.resolve({ data: null, error: new Error('Mock resend error') });
      }
      return Promise.resolve({ data: { id: 'mock-email-id' }, error: null });
    }),
  },
}));
