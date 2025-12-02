// src/app/_components/teacher/FileUpload.tsx
'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '~/utils/api';

interface FileUploadProps {
  courseId: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ courseId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploading' | 'success' | 'error'>>({});
  const [uploadMessages, setUploadMessages] = useState<Record<string, string>>({});

  const generatePresignedUrlMutation = api.teacher.generatePresignedUrl.useMutation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    setUploading(true);

    for (const file of files) {
      setUploadStatus((prev) => ({ ...prev, [file.name]: 'uploading' }));
      setUploadMessages((prev) => ({ ...prev, [file.name]: 'Generating presigned URL...' }));

      try {
        const { uploadUrl, filePath } = await generatePresignedUrlMutation.mutateAsync({
          fileName: file.name,
          fileType: file.type,
          courseId: courseId,
        });

        setUploadMessages((prev) => ({ ...prev, [file.name]: 'Uploading file...' }));

        // Upload to Supabase Storage using the presigned URL
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }

        setUploadStatus((prev) => ({ ...prev, [file.name]: 'success' }));
        setUploadMessages((prev) => ({ ...prev, [file.name]: `Successfully uploaded to: ${filePath}` }));
      } catch (error) {
        setUploadStatus((prev) => ({ ...prev, [file.name]: 'error' }));
        setUploadMessages((prev) => ({ ...prev, [file.name]: `Upload error: ${(error as Error).message}` }));
        console.error('File upload error:', error);
      }
    }
    setUploading(false);
    setFiles([]); // Clear files after upload attempt
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-400 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
        {files.length === 0 ? (
          <p className="text-gray-500">No files selected.</p>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file.name} className="flex justify-between items-center py-1">
                <span>{file.name}</span>
                {uploadStatus[file.name] && (
                  <span
                    className={`text-sm ${
                      uploadStatus[file.name] === 'success'
                        ? 'text-green-600'
                        : uploadStatus[file.name] === 'error'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`}
                  >
                    {uploadMessages[file.name]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
      >
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>

      {/* General upload messages or summary */}
      {Object.keys(uploadStatus).length > 0 && !uploading && (
        <div className="mt-4 p-2 border rounded-md">
          <h4 className="font-semibold">Upload Summary:</h4>
          {Object.entries(uploadStatus).map(([fileName, status]) => (
            <p key={fileName} className={`text-sm ${
                status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {fileName}: {uploadMessages[fileName]}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};