// src/server/webhooks/supabase-storage-trigger.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { env } from '~/env'; // Assuming env for SUPABASE_WEBHOOK_SECRET, PINECONE_API_KEY, OPENAI_API_KEY, etc.
import { IngestionService } from '~/server/ingestion'; // Corrected import
import { NotificationService } from '~/server/services/notification'; // Placeholder for notification service
import { createClient } from '@supabase/supabase-js'; // For downloading the file

// Initialize Supabase client for file download
// Assuming SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in env
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Initialize IngestionService outside the handler for better performance (singleton)
// TODO: Ensure these environment variables are correctly configured in .env and env.mjs
const ingestionService = new IngestionService(
  env.PINECONE_API_KEY,
  env.PINECONE_ENVIRONMENT,
  env.PINECONE_INDEX_NAME,
  env.OPENAI_API_KEY // Assuming OpenAI for embeddings as per context.xml dependencies
);

// Instantiate NotificationService
const notificationService = new NotificationService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Validate Supabase event header
  const supabaseEvent = req.headers['x-supabase-event'] as string;
  if (!supabaseEvent || supabaseEvent !== 'STORAGE_OBJECT_CREATED') {
    return res.status(400).json({ message: 'Invalid Supabase event type' });
  }

  // Optional: Add a secret key check for webhook security
  // const secret = req.headers['x-supabase-webhook-secret'] as string;
  // if (secret !== env.SUPABASE_WEBHOOK_SECRET) { // You would set this in Supabase webhook configuration
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  const { bucketId, objectId, name: filePath } = req.body;

  if (!bucketId || !objectId || !filePath) {
    return res.status(400).json({ message: 'Missing required fields in payload' });
  }

  console.log(`Received Supabase storage event: ${supabaseEvent} for file: ${filePath} in bucket: ${bucketId}`);

  // TODO: Implement logic to retrieve the teacher's email associated with the uploaded document.
  // This could involve:
  // 1. Storing metadata with the uploaded file in Supabase Storage that includes the uploader's ID/email.
  // 2. Querying the database to link the bucketId or filePath to a teacher's course and then to the teacher's email.
  // For now, using a placeholder email.
  const teacherEmail = 'teacher@example.com'; // Placeholder - MUST be replaced with actual logic

  try {
    // 1. Download the file from Supabase Storage
    const { data, error: downloadError } = await supabase.storage.from(bucketId).download(filePath);

    if (downloadError) {
      throw new Error(`Failed to download file from Supabase Storage: ${downloadError.message}`);
    }
    if (!data) {
        throw new Error('Downloaded file data is null.');
    }

    // Determine file type (simple example, can be improved)
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    let fileType: string;

    switch (fileExtension) {
      case 'pdf':
        fileType = 'application/pdf';
        break;
      case 'docx':
        fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'txt':
        fileType = 'text/plain';
        break;
      case 'pptx':
        fileType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      default:
        fileType = 'application/octet-stream'; // Generic binary
    }


    // The ingestion service expects a Buffer
    const buffer = Buffer.from(await data.arrayBuffer());

    // 2. Process the document using the IngestionService
    // TODO: Need to determine the courseId associated with the uploaded file
    // For now, using a placeholder 'UNKNOWN_COURSE' or derive from bucketId/metadata if possible
    const courseId = 'UNKNOWN_COURSE'; // This needs to be resolved based on how files are organized in storage or metadata

    await ingestionService.processDocument(buffer, fileType, filePath, courseId);

    // Notify teacher of successful processing
    await notificationService.sendEmail(
        teacherEmail,
        'Document Processed Successfully',
        `Your document <b>${filePath}</b> has been successfully processed and added to the chatbot's knowledge base.`
    );
    console.log(`Successfully processed and ingested document: ${filePath}`);

    res.status(200).json({ message: 'Document processing initiated successfully' });
  } catch (error) {
    console.error(`Error processing document ${filePath}:`, error);

    // Notify teacher of processing failure
    await notificationService.sendEmail(
        teacherEmail,
        'Document Processing Failed',
        `There was an error processing your document <b>${filePath}</b>. Error: <i>${(error as Error).message}</i>`
    );

    res.status(500).json({ message: 'Failed to initiate document processing', error: (error as Error).message });
  }
}
