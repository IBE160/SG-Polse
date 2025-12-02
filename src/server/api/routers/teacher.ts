// src/server/api/routers/teacher.ts
import { z } from "zod";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import { SupabaseService } from "../../services/supabase"; // Import SupabaseService

export const teacherRouter = createTRPCRouter({
  getTeacherCourses: teacherProcedure
    .query(async ({ ctx }) => {
      const courses = await ctx.prisma.course.findMany({
        where: {
          teachers: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return courses;
    }),

  generatePresignedUrl: teacherProcedure
    .input(z.object({
      fileName: z.string(),
      fileType: z.string(),
      courseId: z.string(), // Assuming courseId is a string (e.g., UUID or CUID)
    }))
    .mutation(async ({ ctx, input }) => {
      // Initialize SupabaseService (ensure environment variables are configured)
      const supabaseService = new SupabaseService(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
      );

      // Authorization check:
      // Verify that the authenticated user is assigned to the course.
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
          teachers: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      if (!course) {
        throw new Error("Unauthorized: Teacher not assigned to this course.");
      }

      // Determine the storage bucket and path
      // Example: files/courseId/fileName
      const bucket = "documents"; // Or a dynamic bucket name based on your setup
      const filePath = `files/${input.courseId}/${input.fileName}`;

      const signedUrlData = await supabaseService.createSignedUploadUrl(
        bucket,
        filePath,
        {
          contentType: input.fileType,
          expiresIn: 3600, // URL valid for 1 hour
        },
      );

      if (!signedUrlData) {
        throw new Error("Failed to generate presigned URL.");
      }

      return {
        uploadUrl: signedUrlData.signedUrl,
        filePath: signedUrlData.filePath,
      };
    }),
});
