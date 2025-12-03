// src/app/_components/teacher/DocumentList.tsx
import { api } from '~/utils/api';
import React, { useState } from 'react';

interface DocumentListProps {
  courseId: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({ courseId }) => {
  const { data: documents, isLoading, error, refetch } = api.teacher.listDocuments.useQuery({ courseId });
  const deleteDocumentMutation = api.teacher.deleteDocument.useMutation({
    onSuccess: () => {
      void refetch(); // Refetch documents after successful deletion
      setConfirmDelete(false); // Close confirmation dialog
      setSelectedDocument(null); // Clear selected document
    },
    onError: (err) => {
      alert(`Failed to delete document: ${err.message}`);
      setConfirmDelete(false); // Close confirmation dialog on error
      setSelectedDocument(null); // Clear selected document
    },
  });

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string; filePath: string; } | null>(null);

  const handleDeleteClick = (doc: { name: string; url: string; filePath: string; }) => {
    setSelectedDocument(doc);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDocument) {
      void deleteDocumentMutation.mutate({ courseId, filePath: selectedDocument.filePath });
    }
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading documents...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading documents: {error.message}</div>;
  }

  if (!documents || documents.length === 0) {
    return <div className="text-gray-500">No documents uploaded yet.</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc.url} className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-2">
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {doc.name}
            </a>
            <button
              onClick={() => handleDeleteClick({ ...doc, filePath: `files/${courseId}/${doc.name}` })}
              className="text-red-500 hover:text-red-700 ml-4"
              disabled={deleteDocumentMutation.isLoading}
            >
              {deleteDocumentMutation.isLoading && selectedDocument?.url === doc.url ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>

      {confirmDelete && selectedDocument && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4">Confirm Deletion</p>
            <p className="mb-4">Are you sure you want to delete &quot;{selectedDocument.name}&quot;?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                disabled={deleteDocumentMutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={deleteDocumentMutation.isLoading}
              >
                {deleteDocumentMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
