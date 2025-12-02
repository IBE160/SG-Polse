import { db } from "~/server/db"; // Assuming this is how the Prisma client is imported

export class TeacherContactService {
  public async getTeacherContactInfo(courseId: string) {
    return db.teacherContactInfo.findUnique({
      where: { courseId },
    });
  }

  // TODO: Add methods for creating/updating teacher contact info (AC: #2)
}