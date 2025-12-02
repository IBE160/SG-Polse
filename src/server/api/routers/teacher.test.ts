// src/server/api/routers/teacher.test.ts
import { jest } from '@jest/globals';
import { appRouter } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';
import { Role } from '@prisma/client';
import { prisma } from '~/server/db';
import { getServerSession } from 'next-auth';
import { SupabaseService } from '~/server/services/supabase'; // Import SupabaseService

jest.mock('next-auth');
jest.mock('~/server/services/supabase'); // Mock SupabaseService

const mockGetServerSession = getServerSession as jest.Mock;
const mockSupabaseService = SupabaseService as jest.MockedClass<typeof SupabaseService>;

describe('teacherRouter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTeacherCourses', () => {
    it('should return courses for a teacher', async () => {
      const session = {
        user: { id: 'teacher-id', role: Role.TEACHER, name: 'Test Teacher', email: 'teacher@test.com' },
        expires: new Date().toISOString(),
      };
      mockGetServerSession.mockResolvedValue(session);

      const caller = appRouter.createCaller(await createTRPCContext({ headers: new Headers() }));

      const courses = [
        { id: 'course-1', name: 'Course 1' },
        { id: 'course-2', name: 'Course 2' },
      ];

      (prisma.course.findMany as jest.Mock).mockResolvedValue(courses);

      const result = await caller.teacher.getTeacherCourses();

      expect(prisma.course.findMany).toHaveBeenCalledWith({
        where: {
          teachers: {
            some: {
              id: 'teacher-id',
            },
          },
        },
      });
      expect(result).toEqual(courses);
    });

    it('should throw an error for a student', async () => {
        const session = {
            user: { id: 'student-id', role: Role.STUDENT, name: 'Test Student', email: 'student@test.com' },
            expires: new Date().toISOString(),
        };
        mockGetServerSession.mockResolvedValue(session);

        const caller = appRouter.createCaller(await createTRPCContext({ headers: new Headers() }));

        await expect(caller.teacher.getTeacherCourses()).rejects.toThrow('You must be a teacher to perform this action.');
    });

    it('should throw an error for unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const caller = appRouter.createCaller(await createTRPCContext({ headers: new Headers() }));

      await expect(caller.teacher.getTeacherCourses()).rejects.toThrow('UNAUTHORIZED');
    });
  });

  describe('generatePresignedUrl', () => {
    const mockInput = {
      fileName: 'test-document.pdf',
      fileType: 'application/pdf',
      courseId: 'course-123',
    };

    it('should successfully generate a presigned URL for an authorized teacher', async () => {
      const session = {
        user: { id: 'teacher-id-1', role: Role.TEACHER, name: 'Teacher 1', email: 'teacher1@test.com' },
        expires: new Date().toISOString(),
      };
      mockGetServerSession.mockResolvedValue(session);

      (prisma.course.findUnique as jest.Mock).mockResolvedValue({
        id: mockInput.courseId,
        teachers: [{ id: session.user.id }],
      });

      // Mock the SupabaseService constructor and its method
      mockSupabaseService.mockImplementation(function (this: SupabaseService, supabaseUrl: string, supabaseAnonKey: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        this.createSignedUploadUrl = jest.fn().mockResolvedValue({
          signedUrl: 'https://mock-signed-url.com/upload',
          filePath: `files/${mockInput.courseId}/${mockInput.fileName}`,
        });
      } as any);


      const caller = appRouter.createCaller(await createTRPCContext({ headers: new Headers() }));

      const result = await caller.teacher.generatePresignedUrl(mockInput);

      expect(prisma.course.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockInput.courseId,
          teachers: {
            some: {
              id: session.user.id,
            },
          },
        },
      });
      // Ensure SupabaseService was instantiated with env vars
      expect(mockSupabaseService).toHaveBeenCalledWith(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
      // Ensure createSignedUploadUrl was called with correct arguments
      expect(mockSupabaseService.mock.results[0].value.createSignedUploadUrl).toHaveBeenCalledWith(
        'documents', // bucket name
        `files/${mockInput.courseId}/${mockInput.fileName}`,
        { contentType: mockInput.fileType, expiresIn: 3600 }
      );
      expect(result).toEqual({
        uploadUrl: 'https://mock-signed-url.com/upload',
        filePath: `files/${mockInput.courseId}/${mockInput.fileName}`,
      });
    });

    it('should throw an error for a student trying to generate a presigned URL', async () => {
      const session = {
        user: { id: 'student-id', role: Role.STUDENT, name: 'Test Student', email: 'student@test.com' },
        expires: new Date().toISOString(),
      };
      mockGetServerSession.mockResolvedValue(session);

      const caller = appRouter.createCaller(await createTRPCContext({ headers: new Headers() }));

      await expect(caller.teacher.generatePresignedUrl(mockInput)).rejects.toThrow('You must be a teacher to perform this action.');
    });

    it('should throw an error if the teacher is not assigned to the course', async () => {
      const session = {
        user: { id: 'teacher-id-unassigned', role: Role.TEACHER, name: 'Unassigned Teacher', email: 'unassigned@test.com' },
        expires: new Date().toISOString(),
      };
      mockGetServerSession.mockResolvedValue(session);

      (prisma.course.findUnique as jest.Mock).mockResolvedValue(null); // Teacher not assigned to course

      const caller = appRouter.createCaller(await createTRPCContext({ headers: new Headers() }));

      await expect(caller.teacher.generatePresignedUrl(mockInput)).rejects.toThrow('Unauthorized: Teacher not assigned to this course.');
    });

    it('should throw an error if SupabaseService fails to generate a presigned URL', async () => {
      const session = {
        user: { id: 'teacher-id-2', role: Role.TEACHER, name: 'Teacher 2', email: 'teacher2@test.com' },
        expires: new Date().toISOString(),
      };
      mockGetServerSession.mockResolvedValue(session);

      (prisma.course.findUnique as jest.Mock).mockResolvedValue({
        id: mockInput.courseId,
        teachers: [{ id: session.user.id }],
      });

      mockSupabaseService.mockImplementation(function (this: SupabaseService, supabaseUrl: string, supabaseAnonKey: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        this.createSignedUploadUrl = jest.fn().mockRejectedValue(new Error('Supabase Storage error'));
      } as any);

      const caller = appRouter.createCaller(await createTRPCContext({ headers: new Headers() }));

      await expect(caller.teacher.generatePresignedUrl(mockInput)).rejects.toThrow('Failed to generate presigned URL.');
    });
  });
});
