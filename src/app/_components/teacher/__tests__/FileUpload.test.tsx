// src/app/_components/teacher/__tests__/FileUpload.test.tsx
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from '../FileUpload';
import { api } from '~/utils/api';
import { useDropzone } from 'react-dropzone';

// Mock the tRPC API hook
jest.mock('~/utils/api', () => ({
  api: {
    teacher: {
      generatePresignedUrl: {
        useMutation: jest.fn(),
      },
    },
  },
}));

// Mock react-dropzone
jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn(),
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockUseMutation = api.teacher.generatePresignedUrl.useMutation as jest.Mock;
const mockUseDropzone = useDropzone as jest.Mock;

describe('FileUpload', () => {
  const MOCK_COURSE_ID = 'course-abc';
  const MOCK_FILE = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
  const MOCK_SIGNED_URL = 'https://mock.signed.url/upload';
  const MOCK_FILE_PATH = 'files/course-abc/hello.pdf';

  let mockMutateAsync: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMutateAsync = jest.fn().mockResolvedValue({
      uploadUrl: MOCK_SIGNED_URL,
      filePath: MOCK_FILE_PATH,
    });
    mockUseMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isLoading: false,
    });

    // Mock useDropzone to simulate file drop
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({
        onDrop: (event: any) => {
          const dataTransfer = {
            files: [MOCK_FILE],
            items: [{ asFile: () => MOCK_FILE }],
            types: ['Files'],
          };
          event.dataTransfer = dataTransfer;
          const onDropCallback = mockUseDropzone.mock.calls[mockUseDropzone.mock.calls.length - 1][0].onDrop;
          onDropCallback([MOCK_FILE]);
        },
      }),
      getInputProps: () => ({}),
      isDragActive: false,
    });
    mockFetch.mockResolvedValue({ ok: true, status: 200 });
  });

  it('should render correctly', () => {
    render(<FileUpload courseId={MOCK_COURSE_ID} />);
    expect(screen.getByText(/Drag 'n' drop some files here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Files/i })).toBeInTheDocument();
  });

  it('should display selected file names after drop', async () => {
    render(<FileUpload courseId={MOCK_COURSE_ID} />);
    const dropzone = screen.getByText(/Drag 'n' drop some files here/i);
    fireEvent.drop(dropzone, { dataTransfer: { files: [MOCK_FILE] } });

    await waitFor(() => {
      expect(screen.getByText(MOCK_FILE.name)).toBeInTheDocument();
    });
  });

  it('should call tRPC mutation and upload file to Supabase when upload button is clicked', async () => {
    render(<FileUpload courseId={MOCK_COURSE_ID} />);

    // Simulate file drop
    const dropzone = screen.getByText(/Drag 'n' drop some files here/i);
    fireEvent.drop(dropzone, { dataTransfer: { files: [MOCK_FILE] } });

    // Click upload button
    const uploadButton = screen.getByRole('button', { name: /Upload Files/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
      expect(mockMutateAsync).toHaveBeenCalledWith({
        fileName: MOCK_FILE.name,
        fileType: MOCK_FILE.type,
        courseId: MOCK_COURSE_ID,
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(MOCK_SIGNED_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': MOCK_FILE.type,
        },
        body: MOCK_FILE,
      });
      expect(screen.getByText(`${MOCK_FILE.name}: Successfully uploaded to: ${MOCK_FILE_PATH}`)).toBeInTheDocument();
    });
  });

  it('should display error message if presigned URL generation fails', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('Failed to get signed URL'));

    render(<FileUpload courseId={MOCK_COURSE_ID} />);
    const dropzone = screen.getByText(/Drag 'n' drop some files here/i);
    fireEvent.drop(dropzone, { dataTransfer: { files: [MOCK_FILE] } });

    const uploadButton = screen.getByRole('button', { name: /Upload Files/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(`${MOCK_FILE.name}: Upload error: Failed to get signed URL`)).toBeInTheDocument();
      expect(mockFetch).not.toHaveBeenCalled(); // Fetch should not be called
    });
  });

  it('should display error message if file upload to Supabase fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Internal Server Error' });

    render(<FileUpload courseId={MOCK_COURSE_ID} />);
    const dropzone = screen.getByText(/Drag 'n' drop some files here/i);
    fireEvent.drop(dropzone, { dataTransfer: { files: [MOCK_FILE] } });

    const uploadButton = screen.getByRole('button', { name: /Upload Files/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText(`${MOCK_FILE.name}: Upload error: Upload failed with status: 500`)).toBeInTheDocument();
    });
  });

  it('should disable upload button when no files are selected', () => {
    render(<FileUpload courseId={MOCK_COURSE_ID} />);
    const uploadButton = screen.getByRole('button', { name: /Upload Files/i });
    expect(uploadButton).toBeDisabled();
  });

  it('should disable upload button while uploading', async () => {
    mockUseMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isLoading: true, // Simulate loading state from tRPC
    });

    render(<FileUpload courseId={MOCK_COURSE_ID} />);
    const dropzone = screen.getByText(/Drag 'n' drop some files here/i);
    fireEvent.drop(dropzone, { dataTransfer: { files: [MOCK_FILE] } });


    const uploadButton = screen.getByRole('button', { name: /Upload Files/i });
    fireEvent.click(uploadButton);

    expect(uploadButton).toBeDisabled();
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });
});
