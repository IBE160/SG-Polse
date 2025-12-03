// src/app/_components/teacher/DocumentList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentList } from './DocumentList';
import { api } from '~/utils/api';
import React from 'react';

// Mock the tRPC API calls
jest.mock('~/utils/api', () => ({
  api: {
    teacher: {
      listDocuments: {
        useQuery: jest.fn(),
      },
      deleteDocument: {
        useMutation: jest.fn(),
      },
    },
  },
}));

const mockListDocumentsUseQuery = api.teacher.listDocuments.useQuery as jest.Mock;
const mockDeleteDocumentUseMutation = api.teacher.deleteDocument.useMutation as jest.Mock;

describe('DocumentList', () => {
  const courseId = 'course-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockListDocumentsUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<DocumentList courseId={courseId} />);
    expect(screen.getByText('Loading documents...')).toBeInTheDocument();
  });

  it('renders error state if query fails', () => {
    mockListDocumentsUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
      refetch: jest.fn(),
    });

    render(<DocumentList courseId={courseId} />);
    expect(screen.getByText('Error loading documents: Failed to fetch')).toBeInTheDocument();
  });

  it('renders "No documents uploaded yet" if no documents are returned', () => {
    mockListDocumentsUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<DocumentList courseId={courseId} />);
    expect(screen.getByText('No documents uploaded yet.')).toBeInTheDocument();
  });

  it('renders a list of documents with delete buttons', () => {
    const documents = [
      { name: 'document1.pdf', url: 'http://example.com/doc1.pdf', size: 1000 },
      { name: 'document2.docx', url: 'http://example.com/doc2.docx', size: 2000 },
    ];
    mockListDocumentsUseQuery.mockReturnValue({
      data: documents,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    mockDeleteDocumentUseMutation.mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
      isError: false,
      error: null,
    });


    render(<DocumentList courseId={courseId} />);

    expect(screen.getByText('Uploaded Documents')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'document1.pdf' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'document2.docx' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
  });

  it('handles document deletion with confirmation', async () => {
    const documents = [
      { name: 'document1.pdf', url: 'http://example.com/doc1.pdf', size: 1000 },
    ];
    const mockRefetch = jest.fn();
    const mockMutate = jest.fn();

    mockListDocumentsUseQuery.mockReturnValue({
      data: documents,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });
    mockDeleteDocumentUseMutation.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
      error: null,
      onSuccess: jest.fn(), // Mock the onSuccess callback
      onError: jest.fn(), // Mock the onError callback
    });

    render(<DocumentList courseId={courseId} />);

    // Click delete button
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    // Confirmation dialog should appear
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete "document1.pdf"?')).toBeInTheDocument();

    // Confirm deletion
    await userEvent.click(screen.getByRole('button', { name: 'Delete', hidden: true })); // Use hidden: true for the second "Delete" button which is in the modal

    await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
            courseId,
            filePath: `files/${courseId}/document1.pdf`,
        });
        expect(mockListDocumentsUseQuery).toHaveBeenCalledTimes(2); // Initial render and after deletion
        expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument(); // Dialog should close
    });
  });

  it('shows deleting state when delete is in progress', async () => {
    const documents = [
      { name: 'document1.pdf', url: 'http://example.com/doc1.pdf', size: 1000 },
    ];
    const mockRefetch = jest.fn();
    const mockMutate = jest.fn();

    mockListDocumentsUseQuery.mockReturnValue({
      data: documents,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });
    mockDeleteDocumentUseMutation.mockReturnValue({
      mutate: mockMutate,
      isLoading: true, // Deletion is in progress
      isError: false,
      error: null,
      onSuccess: jest.fn(), // Mock the onSuccess callback
      onError: jest.fn(), // Mock the onError callback
    });

    render(<DocumentList courseId={courseId} />);

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete', hidden: true }));

    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeInTheDocument();
  });
});
