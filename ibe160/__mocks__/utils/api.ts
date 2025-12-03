// ibe160/__mocks__/utils/api.ts

// This is a mock for the tRPC API client to be used in Jest tests.
// It provides mock implementations for the tRPC procedures used in UI components.

export const api = {
  teacher: {
    listDocuments: {
      useQuery: jest.fn(),
    },
    deleteDocument: {
      useMutation: jest.fn(),
    },
  },
};
