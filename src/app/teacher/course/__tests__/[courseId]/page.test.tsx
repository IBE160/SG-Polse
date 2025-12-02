// src/app/teacher/course/__tests__/[courseId]/page.test.tsx
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import CourseContentManagementPage from '../[courseId]/page';
import { api } from '~/utils/api';
import * as NextNavigation from 'next/navigation'; // Import all from next/navigation

jest.mock('~/utils/api', () => ({
  api: {
    teacher: {
      getTeacherCourses: {
        useQuery: jest.fn(),
      },
    },
  },
}));

jest.mock('next/navigation', () => ({
  __esModule: true,
  ...jest.requireActual('next/navigation'), // Use actual for non-mocked exports
  notFound: jest.fn(), // Mock notFound explicitly
}));

const mockUseQuery = api.teacher.getTeacherCourses.useQuery as jest.Mock;
const mockNotFound = (NextNavigation as any).notFound as jest.Mock; // Type assertion for mock

describe('CourseContentManagementPage', () => {
  const MOCK_COURSE_ID = 'course-123';
  const MOCK_COURSE_NAME = 'Test Course';
  const MOCK_COURSES = [
    { id: 'course-other', name: 'Other Course' },
    { id: MOCK_COURSE_ID, name: MOCK_COURSE_NAME },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render course details and file upload placeholder when data is loaded', () => {
    mockUseQuery.mockReturnValue({
      data: MOCK_COURSES,
      isLoading: false,
      error: undefined,
    });

    render(<CourseContentManagementPage params={{ courseId: MOCK_COURSE_ID }} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`Content Management for ${MOCK_COURSE_NAME}`);
    expect(screen.getByText('Manage documents for this course.')).toBeInTheDocument();
    expect(screen.getByText('File Upload Component Placeholder')).toBeInTheDocument();
  });

  it('should show loading message when data is loading', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    render(<CourseContentManagementPage params={{ courseId: MOCK_COURSE_ID }} />);

    expect(screen.getByText('Loading course details...')).toBeInTheDocument();
  });

  it('should show error message when data fetching fails', () => {
    const errorMessage = 'Failed to fetch courses';
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error(errorMessage),
    });

    render(<CourseContentManagementPage params={{ courseId: MOCK_COURSE_ID }} />);

    expect(screen.getByText(`Error loading course: ${errorMessage}`)).toBeInTheDocument();
  });

  it('should call notFound if the course is not found in the list', () => {
    mockUseQuery.mockReturnValue({
      data: MOCK_COURSES,
      isLoading: false,
      error: undefined,
    });

    render(<CourseContentManagementPage params={{ courseId: 'non-existent-course' }} />);

    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it('should call notFound if data is empty', () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
    });

    render(<CourseContentManagementPage params={{ courseId: MOCK_COURSE_ID }} />);

    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });
});
