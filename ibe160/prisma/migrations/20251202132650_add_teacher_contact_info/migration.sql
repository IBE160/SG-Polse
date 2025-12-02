-- CreateTable
CREATE TABLE "TeacherContactInfo" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "contactMethod" TEXT NOT NULL,
    "contactDetails" TEXT NOT NULL,

    CONSTRAINT "TeacherContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeacherContactInfo_courseId_key" ON "TeacherContactInfo"("courseId");
