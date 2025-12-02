// src/app/_components/teacher/CourseList.test.tsx
import { render, screen } from '@testing-library/react';
import { CourseList } from './CourseList';
import { api } from '~/trpc/react';
import { jest } from '@jest/globals';

describe('CourseList', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (api.teacher.getTeacherCourses.useQuery as jest.Mock).mockReset();
  });

  it('renders loading state initially', () => {
    (api.teacher.getTeacherCourses.useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<CourseList />);
    expect(screen.getByText('Loading courses...')).toBeInTheDocument();
  });

  it('renders error state if query fails', () => {
    (api.teacher.getTeacherCourses.useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch courses'),
    });

    render(<CourseList />);
    expect(screen.getByText('Error: Failed to fetch courses')).toBeInTheDocument();
  });

  it('renders message when no courses are assigned', () => {
    (api.teacher.getTeacherCourses.useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<CourseList />);
    expect(screen.getByText('You are not assigned to any courses.')).toBeInTheDocument();
  });

  it('renders a list of courses', () => {
    const mockCourses = [
      { id: '1', name: 'Math 101' },
      { id: '2', name: 'History 201' },
    ];
    (api.teacher.getTeacherCourses.useQuery as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      error: null,
    });

    render(<CourseList />);
    expect(screen.getByText('Your Courses')).toBeInTheDocument();
    expect(screen.getByText('Math 101')).toBeInTheDocument();
    expect(screen.getByText('History 201')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Math 101' })).toHaveAttribute('href', '/teacher/course/1/manage');
  });
});