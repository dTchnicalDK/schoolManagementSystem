import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET() {
  // 1. Auth guard
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Fetch accepted applications
  const applications = await prisma.application.findMany({
    where: { status: "ACCEPTED", deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      parent: { select: { name: true, email: true, phone: true } },
      reviewAssignment: {
        select: {
          recommendation: true,
          remarks: true,
          reviewer: { select: { name: true } },
        },
      },
    },
  });

  // 3. Build Excel workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "School Admission Portal";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Accepted Applications");

  // 4. Define columns
  sheet.columns = [
    { header: "S.No", key: "sno", width: 6 },
    { header: "Student Name", key: "studentName", width: 22 },
    { header: "Date of Birth", key: "dob", width: 15 },
    { header: "Gender", key: "gender", width: 10 },
    { header: "Applying Class", key: "applyingClass", width: 16 },
    { header: "Previous School", key: "previousSchool", width: 24 },
    { header: "Parent Name", key: "parentName", width: 20 },
    { header: "Parent Email", key: "parentEmail", width: 26 },
    { header: "Parent Phone", key: "parentPhone", width: 16 },
    { header: "Reviewer", key: "reviewer", width: 20 },
    { header: "Recommendation", key: "recommendation", width: 16 },
    { header: "Remarks", key: "remarks", width: 30 },
    { header: "Applied On", key: "createdAt", width: 15 },
  ];

  // 5. Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E3A5F" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 20;

  // 6. Add data rows
  applications.forEach((app, index) => {
    const row = sheet.addRow({
      sno: index + 1,
      studentName: app.studentName,
      dob: new Date(app.dob).toLocaleDateString("en-IN"),
      gender: app.gender,
      applyingClass: app.applyingClass,
      previousSchool: app.previousSchool ?? "—",
      parentName: app.parent.name ?? "—",
      parentEmail: app.parent.email ?? "—",
      parentPhone: app.parent.phone ?? "—",
      reviewer: app.reviewAssignment?.reviewer?.name ?? "—",
      recommendation: app.reviewAssignment?.recommendation ?? "—",
      remarks: app.reviewAssignment?.remarks ?? "—",
      createdAt: new Date(app.createdAt).toLocaleDateString("en-IN"),
    });

    // Alternate row background for readability
    if (index % 2 === 0) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF0F4F8" },
      };
    }

    row.alignment = { vertical: "middle" };
  });

  // 7. Freeze header row so it stays visible while scrolling
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  // 8. Write workbook to buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // 9. Return as downloadable response
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="accepted-applications-${Date.now()}.xlsx"`,
    },
  });
}
