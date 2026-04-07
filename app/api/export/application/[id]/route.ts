import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. Auth guard
  const session = await auth();
  if (!session || session.user?.role !== "PARENT") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  // 2. Fetch application — ensure it belongs to this parent
  const application = await prisma.application.findFirst({
    where: { id, parentId: session.user.id, deletedAt: null },
    include: {
      parent: {
        select: { name: true, email: true, phone: true, address: true },
      },
    },
  });

  if (!application) {
    return new Response("Not found", { status: 404 });
  }

  // 3. Create PDF document
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4 size in points

  // 4. Embed fonts
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  // 5. Page dimensions
  const { width, height } = page.getSize();
  const margin = 50;
  const contentWidth = width - margin * 2;

  // ─── Helper functions ────────────────────────────────────────────

  // current Y cursor — we move it down as we draw
  let y = height - margin;

  function moveDown(amount: number) {
    y -= amount;
  }

  function drawText(
    text: string,
    options: {
      size?: number;
      bold?: boolean;
      color?: [number, number, number];
      x?: number;
      align?: "left" | "right" | "center";
    } = {},
  ) {
    const {
      size = 11,
      bold = false,
      color = [0.1, 0.1, 0.1],
      x = margin,
      align = "left",
    } = options;

    const font = bold ? fontBold : fontRegular;
    let drawX = x;

    if (align === "center") {
      const textWidth = font.widthOfTextAtSize(text, size);
      drawX = (width - textWidth) / 2;
    } else if (align === "right") {
      const textWidth = font.widthOfTextAtSize(text, size);
      drawX = width - margin - textWidth;
    }

    page.drawText(text, {
      x: drawX,
      y,
      size,
      font,
      color: rgb(...color),
    });
  }

  function drawHorizontalLine(
    options: { thickness?: number; color?: [number, number, number] } = {},
  ) {
    const { thickness = 0.5, color = [0.8, 0.8, 0.8] } = options;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness,
      color: rgb(...color),
    });
  }

  function drawFilledRect(rectHeight: number, color: [number, number, number]) {
    page.drawRectangle({
      x: margin,
      y: y - rectHeight + 12,
      width: contentWidth,
      height: rectHeight,
      color: rgb(...color),
    });
  }

  function drawSectionHeader(title: string) {
    moveDown(16);
    drawFilledRect(22, [0.12, 0.23, 0.37]); // dark navy
    moveDown(4);
    drawText(title, { bold: true, size: 10, color: [1, 1, 1] });
    moveDown(18);
  }

  function drawRow(label: string, value: string) {
    drawText(label, { size: 10, color: [0.45, 0.45, 0.45] });
    drawText(value, { size: 10, x: margin + 160 });
    moveDown(18);
  }

  // ─── Start drawing ───────────────────────────────────────────────

  // Header background
  page.drawRectangle({
    x: 0,
    y: height - 90,
    width: width,
    height: 90,
    color: rgb(0.12, 0.23, 0.37),
  });

  // School name
  y = height - 32;
  drawText("SCHOOL ADMISSION PORTAL", {
    bold: true,
    size: 18,
    color: [1, 1, 1],
    align: "center",
  });

  moveDown(22);
  drawText("APPLICATION FORM", {
    size: 11,
    color: [0.75, 0.85, 1],
    align: "center",
  });

  // Meta info
  y = height - 108;
  drawText(`Application ID: ${application.id}`, {
    size: 9,
    color: [0.45, 0.45, 0.45],
  });
  drawText(
    `Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
    { size: 9, color: [0.45, 0.45, 0.45], align: "right" },
  );

  moveDown(12);
  drawHorizontalLine();

  // ─── Student Information ─────────────────────────────────────────
  drawSectionHeader("  STUDENT INFORMATION");

  drawRow("Student Name", application.studentName);
  drawRow(
    "Date of Birth",
    new Date(application.dob).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );
  drawRow("Gender", application.gender);
  drawRow("Applying For", application.applyingClass);
  drawRow("Previous School", application.previousSchool ?? "Not provided");

  moveDown(4);
  drawHorizontalLine();

  // ─── Parent Information ──────────────────────────────────────────
  drawSectionHeader("  PARENT / GUARDIAN INFORMATION");

  drawRow("Name", application.parent.name ?? "—");
  drawRow("Email", application.parent.email ?? "—");
  drawRow("Phone", application.parent.phone ?? "—");
  drawRow("Address", application.parent.address ?? "—");

  moveDown(4);
  drawHorizontalLine();

  // ─── Application Status ──────────────────────────────────────────
  drawSectionHeader("  APPLICATION STATUS");

  drawRow("Status", application.status);
  drawRow(
    "Applied On",
    new Date(application.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );

  moveDown(4);
  drawHorizontalLine();

  // ─── Footer ──────────────────────────────────────────────────────
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 36,
    color: rgb(0.96, 0.96, 0.96),
  });

  page.drawText("This is a system-generated document.", {
    x: margin,
    y: 13,
    size: 8,
    font: fontRegular,
    color: rgb(0.6, 0.6, 0.6),
  });

  page.drawText("School Admission Portal", {
    x:
      width -
      margin -
      fontRegular.widthOfTextAtSize("School Admission Portal", 8),
    y: 13,
    size: 8,
    font: fontRegular,
    color: rgb(0.6, 0.6, 0.6),
  });

  // 6. Serialize to buffer
  const pdfBytes = await doc.save();

  // 7. Return as downloadable response
  const filename = `application-${application.studentName.replace(/\s+/g, "-").toLowerCase()}.pdf`;

  const buffer = Buffer.from(pdfBytes);
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
