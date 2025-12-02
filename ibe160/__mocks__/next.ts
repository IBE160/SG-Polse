// ibe160/__mocks__/next.ts

// Mock NextApiRequest and NextApiResponse
export type NextApiRequest = {
  method?: string;
  headers: Record<string, string | string[]>;
  body: any;
  query: any;
  cookies: { [key: string]: string };
  // Add other properties as needed for testing
};

export type NextApiResponse = {
  status: jest.Mock;
  json: jest.Mock;
  send: jest.Mock;
  end: jest.Mock;
  setHeader: jest.Mock;
  // Add other properties as needed for testing
};

// If there are other named exports from 'next' that are being used, they should be mocked here too.
// For example, if 'NextPage' or 'GetServerSidePropsContext' are used, define them.
