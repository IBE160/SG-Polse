// src/server/services/canvas.test.ts

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import CanvasApiClient from './canvas';
import { env } from '~/env'; // This will be mocked

// Mock the environment variables for testing
jest.mock('~/env', () => ({
  env: {
    CANVAS_API_URL: 'https://mock-canvas.instructure.com/api/v1',
    CANVAS_API_TOKEN: 'mock_token',
  },
}));

// Mock the global fetch function
const mockFetch = jest.spyOn(global, 'fetch');

describe('CanvasApiClient', () => {
  let client: CanvasApiClient;

  beforeEach(() => {
    // Reset mocks before each test
    mockFetch.mockClear();
    client = new CanvasApiClient();
  });

  it('should be instantiated with environment variables by default', () => {
    expect(client).toBeInstanceOf(CanvasApiClient);
    // Directly accessing private properties is generally not recommended but can be done for testing specific implementations
    // For this example, we'll rely on public methods to infer correct initialization
    const headers = client.getAuthHeaders();
    expect(headers.Authorization).toBe(`Bearer ${env.CANVAS_API_TOKEN}`);
  });

  it('should be instantiated with constructor arguments if provided', () => {
    const customUrl = 'https://custom-canvas.com';
    const customToken = 'custom_token';
    const customClient = new CanvasApiClient(customUrl, customToken);
    const headers = customClient.getAuthHeaders();
    // Assuming there's a way to verify the apiUrl, e.g., via a dummy method or internal check
    expect(headers.Authorization).toBe(`Bearer ${customToken}`);
  });

  it('should throw an error if no API URL or token is provided', () => {
    // Temporarily unset env vars for this test
    const originalCanvasApiUrl = env.CANVAS_API_URL;
    const originalCanvasApiToken = env.CANVAS_API_TOKEN;
    env.CANVAS_API_URL = undefined as any;
    env.CANVAS_API_TOKEN = undefined as any;

    expect(() => new CanvasApiClient(undefined, undefined)).toThrow(
      "CanvasApiClient: API URL and Token are required, either via constructor or environment variables.",
    );

    // Restore env vars
    env.CANVAS_API_URL = originalCanvasApiUrl;
    env.CANVAS_API_TOKEN = originalCanvasApiToken;
  });


  it('getAuthHeaders should return the correct Authorization header', () => {
    const headers = client.getAuthHeaders();
    expect(headers).toEqual({
      Authorization: `Bearer ${env.CANVAS_API_TOKEN}`,
    });
  });

  describe('fetchCourses', () => {
    it('should fetch courses successfully', async () => {
      const mockCourses = [{ id: 1, name: 'Course 1' }, { id: 2, name: 'Course 2' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourses,
        text: async () => JSON.stringify(mockCourses), // Required for error path
        status: 200,
        statusText: 'OK',
      } as Response);

      const courses = await client.fetchCourses();

      expect(mockFetch).toHaveBeenCalledWith(`${env.CANVAS_API_URL}/courses`, {
        headers: client.getAuthHeaders(),
      });
      expect(courses).toEqual([
        { id: '1', name: 'Course 1' },
        { id: '2', name: 'Course 2' },
      ]);
    });

    it('should handle API errors when fetching courses', async () => {
      const errorMessage = 'Unauthorized';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: async () => errorMessage,
        status: 401,
        statusText: 'Unauthorized',
      } as Response);

      await expect(client.fetchCourses()).rejects.toThrow(
        `Failed to fetch courses: 401 Unauthorized - ${errorMessage}`,
      );
    });

    it('should handle network errors when fetching courses', async () => {
      const networkError = new Error('Network Down');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(client.fetchCourses()).rejects.toThrow(
        `Failed to fetch courses: ${networkError.message}`,
      );
    });
  });

  describe('fetchCourseDocuments', () => {
    const courseId = '123';

    it('should fetch course documents successfully', async () => {
      const mockDocuments = [{ id: 101, display_name: 'Doc 1', url: 'http://example.com/doc1' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDocuments,
        text: async () => JSON.stringify(mockDocuments), // Required for error path
        status: 200,
        statusText: 'OK',
      } as Response);

      const documents = await client.fetchCourseDocuments(courseId);

      expect(mockFetch).toHaveBeenCalledWith(`${env.CANVAS_API_URL}/courses/${courseId}/files`, {
        headers: client.getAuthHeaders(),
      });
      expect(documents).toEqual([
        { id: '101', display_name: 'Doc 1', url: 'http://example.com/doc1' },
      ]);
    });

    it('should handle API errors when fetching course documents', async () => {
      const errorMessage = 'Course Not Found';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: async () => errorMessage,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(client.fetchCourseDocuments(courseId)).rejects.toThrow(
        `Failed to fetch documents for course ${courseId}: 404 Not Found - ${errorMessage}`,
      );
    });

    it('should handle network errors when fetching course documents', async () => {
      const networkError = new Error('No Internet');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(client.fetchCourseDocuments(courseId)).rejects.toThrow(
        `Failed to fetch documents for course ${courseId}: ${networkError.message}`,
      );
    });
  });
});
