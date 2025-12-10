"use client";

import { useState, type FC } from "react";
import Link from "next/link"; // Import Link

const UploadPage: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [ingestionMessage, setIngestionMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setSummary(""); // Clear previous summary
    setUploadedFilename(null); // Clear previous filename
    setIngestionMessage(""); // Clear previous ingestion message

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setUploadedFilename(file.name);
      } else {
        setMessage(`Error: ${data.error || "An unknown error occurred during upload."}`);
      }
    } catch (error: any) {
      setMessage(`An unexpected error occurred during upload: ${error.message || ""}`);
    }
  };

  const handleSummarize = async () => {
    if (!uploadedFilename) {
      setMessage("No file uploaded to summarize.");
      return;
    }

    setIsSummarizing(true);
    setSummary(""); // Clear previous summary

    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: uploadedFilename }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
      } else {
        setMessage(`Error summarizing: ${data.error || "An unknown error occurred during summarization."}`);
      }
    } catch (error: any) {
      setMessage(`An unexpected error occurred during summarization: ${error.message || ""}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleIngest = async () => {
    setIsIngesting(true);
    setIngestionMessage("");

    try {
      const response = await fetch("/api/ai/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIngestionMessage(data.message);
      } else {
        setIngestionMessage(`Error during ingestion: ${data.error || "An unknown error occurred during ingestion."}`);
      }
    } catch (error: any) {
      setIngestionMessage(`An unexpected error occurred during ingestion: ${error.message || ""}`);
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Upload a Document</h1>
        <Link href="/student/dashboard" legacyBehavior>
          <a className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Back to Dashboard
          </a>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Choose a file
          </label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}

      <div className="mt-8 space-y-4"> {/* Group document actions */}
        {uploadedFilename && uploadedFilename.toLowerCase().endsWith(".pdf") && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Document Specific Actions</h2>
            <button
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isSummarizing ? "Summarizing..." : "Summarize Document"}
            </button>
          </div>
        )}

        <div className="pt-4"> {/* Separator for ingestion button */}
          <h2 className="text-2xl font-bold mb-2">Global Document Actions</h2>
          <button
            onClick={handleIngest}
            disabled={isIngesting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isIngesting ? "Ingesting All..." : "Ingest All Documents for AI"}
          </button>
          {ingestionMessage && <p className="mt-4 text-sm text-gray-600">{ingestionMessage}</p>}
        </div>
      </div>

      {summary && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <h2 className="text-2xl font-bold mb-2">Summary</h2>
          <p className="text-gray-800">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
