// src/server/services/canvas.ts

import { env } from "~/env"; // Import environment variables

interface CanvasCourse {
  id: string;
  name: string;
  // Add other relevant course properties as needed
}

interface CanvasDocument {
  id: string;
  display_name: string;
  url: string;
  // Add other relevant document properties as needed
}

class CanvasApiClient {
  private apiUrl: string;
  private apiToken: string;

  constructor(apiUrl?: string, apiToken?: string) {
    // Use values from env if not provided
    this.apiUrl = apiUrl || env.CANVAS_API_URL;
    this.apiToken = apiToken || env.CANVAS_API_TOKEN;

    if (!this.apiUrl || !this.apiToken) {
      throw new Error("CanvasApiClient: API URL and Token are required, either via constructor or environment variables.");
    }
  }

  getAuthHeaders(): { Authorization: string } {
    return {
      Authorization: `Bearer ${this.apiToken}`,
    };
  }

  async fetchCourses(): Promise<CanvasCourse[]> {
    try {
      const response = await fetch(`${this.apiUrl}/courses`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorBody = await response.text();
        throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      const courses: any[] = await response.json();
      
      // Basic mapping to CanvasCourse interface
      return courses.map(course => ({
        id: course.id.toString(), // Ensure ID is string
        name: course.name,
      }));

    } catch (error) {
      console.error("Error fetching Canvas courses:", error);
      throw new Error(`Failed to fetch courses: ${(error as Error).message}`);
    }
  }

  async fetchCourseDocuments(courseId: string): Promise<CanvasDocument[]> {
    try {
      const response = await fetch(`${this.apiUrl}/courses/${courseId}/files`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorBody = await response.text();
        throw new Error(`Failed to fetch documents for course ${courseId}: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      const documents: any[] = await response.json();
      
      // Basic mapping to CanvasDocument interface
      return documents.map(doc => ({
        id: doc.id.toString(), // Ensure ID is string
        display_name: doc.display_name,
        url: doc.url,
      }));

    } catch (error) {
      console.error(`Error fetching Canvas documents for course ${courseId}:`, error);
      throw new Error(`Failed to fetch documents for course ${courseId}: ${(error as Error).message}`);
    }
  }
}

export default CanvasApiClient;
