import Member from "../model/memberModel.js";
import ApiFeature from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
export const createMember = catchAsync(async (req, res, next) => {
  const { fullName, phone, avatar, gender, membership, payments } = req.body;

  const exitingUser = await Member.findOne({ phone });
  if (exitingUser) {
    return next(new AppError("Member with this phone already exists", 409));
  }

  const newMember = await Member.create({
    fullName,
    phone,
    gender,
    avatar,
    membership,
    payments,
  });

  res.status(200).json({
    status: "success",
    message: "Member created successfully",
    data: newMember,
  });
});
export const getMemebrs = catchAsync(async (req, res, next) => {
  console.log(req.query);
  let query = Member.find();
  let apiFeature = new ApiFeature(query, req.query)
    .filter()
    .search()
    .range()
    .pagination();

  const members = await apiFeature.query;
  const filteredCountQuery = Member.find();
  new ApiFeature(filteredCountQuery, req.query).filter().range();
  const totalDocs = await filteredCountQuery.countDocuments();

  const limit = 10;
  const totalPage = Math.ceil(totalDocs / limit);
  console.log(members);
  res.status(200).json({
    status: "success",
    total: totalPage,
    data: members,
  });
});

export const getMemebr = catchAsync(async (req, res, next) => {
  const memberId = req.params;
  const member = await Member.findById(memberId);
  if (!member) {
    return next(new AppError("Memver is not exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: member,
  });
});
export const updateMember = catchAsync(async (req, res, next) => {
  const memberId = req.params;
  const allowedFields = [
    "fullName",
    "phone",
    "gender",
    "avatar",
    "membership",
    "payments",
  ];

  const updatedData: Record<string, any> = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      updatedData[key] = req.body[key];
    }
  });

  if (Object.keys(updatedData).length === 0) {
    return next(new AppError("No valid fields provided for update", 400));
  }

  const updateMember = await Member.findByIdAndUpdate(memberId, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Member updated successfully",
    data: updateMember,
  });
});

export const renewMembership = catchAsync(async (req, res, next) => {
  const memberId = req.params;
  const { months, amount, method } = req.body;

  if (!months || months <= 0)
    return next(new AppError("Please provide valid months.", 400));
  if (!amount || amount <= 0)
    return next(new AppError("Please provide valid amount.", 400));

  const member = await Member.findById(memberId);
  if (!member) return next(new AppError("Member not found.", 404));

  const updateMember = await member.renewMembership(months, amount, method);
  res.status(200).json({
    status: "success",
    message: `Membership renewed for ${months} month(s)`,
    data: updateMember,
  });
});

export const deleteMember = catchAsync(async (req, res, next) => {
  const memberId = req.params;
  await Member.findByIdAndUpdate(memberId, { isActive: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const formatDate = (date: Date | undefined) =>
  date ? new Date(date).toLocaleDateString("en-GB") : "-";

export const generateReport = catchAsync(async (req, res, next) => {
  const features = new ApiFeature(Member.find(), req.query).filter().range();
  const members = await features.query;

  const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });
  res
    .set("Content-Type", "application/pdf")
    .set("Content-Disposition", "attachment; filename=gym_member_report.pdf");
  doc.pipe(res);

  // === COLOR SCHEME (from your Tailwind theme) ===
  const colors = {
    primary: "#E67817", // Tailwind --primary (oklch(70.755% 0.19742 46.444))
    accent: "#F9FAFB", // --accent
    dark: "#1E1E1E", // --foreground dark mode
    muted: "#6B7280", // --muted-foreground
    border: "#E5E7EB", // --border
    light: "#FFFFFF",
    destructive: "#DC2626",
    success: "#198754",
    inactive: "#6C757D",
  };

  const usableWidth = doc.page.width - 100;

  // === HEADER BAR ===
  const logoPath = path.join("server", "src", "images", "gym.png");
  if (fs.existsSync(logoPath)) doc.image(logoPath, 50, 15, { width: 40 });

  doc
    .save()
    .rect(0, 0, doc.page.width, 70)
    .fillColor(colors.primary)
    .fill()
    .restore();

  doc
    .fillColor("#fff")
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("MY GYM FITNESS CENTER", 100, 25)
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#fdf1e4")
    .text("Official Member Report", 100, 45);

  doc.moveDown(3);

  // === META INFO BOX ===
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(colors.dark)
    .text("Report Details", 50);

  const boxY = doc.y + 5;
  doc
    .rect(50, boxY, usableWidth, 60)
    .fillAndStroke(colors.accent, colors.border);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(colors.dark)
    .text(`Generated: ${new Date().toLocaleString("en-GB")}`, 60, boxY + 10)
    .text(`Status: ${req.query.status || "All"}`, 60, boxY + 25)
    .text(`Range: ${req.query.range || "All"}`, 250, boxY + 25)
    .text(`Search: ${req.query.search || "None"}`, 420, boxY + 25);

  doc.moveDown(5);

  // === STATS CARDS ===
  const total = members.length;
  const active = members.filter((m) => m.isActive).length;
  const expired = members.filter(
    (m) => m.membership?.status === "expired"
  ).length;
  const inactive = total - active;

  const stats = [
    { title: "Total Members", value: total, color: colors.primary },
    { title: "Active", value: active, color: colors.success },
    { title: "Inactive", value: inactive, color: colors.inactive },
    { title: "Expired", value: expired, color: colors.destructive },
  ];

  const cardW = 120,
    cardH = 50,
    x0 = 50,
    gap = 20,
    y0 = doc.y;
  stats.forEach((s, i) => {
    const x = x0 + i * (cardW + gap);
    doc
      .rect(x, y0, cardW, cardH)
      .fillAndStroke(s.color, s.color)
      .fillColor("#fff")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(s.title, x + 8, y0 + 7)
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(String(s.value), x + 8, y0 + 25);
  });

  doc.moveDown(5);

  // === TABLE HEADER ===
  const cols = ["#", "Full Name", "Phone", "Gender", "Status", "Plan", "Ends"];
  const pos = [55, 85, 220, 320, 380, 460, 525];

  const drawHeader = (y: number) => {
    doc
      .rect(50, y, usableWidth, 24)
      .fillAndStroke(colors.primary, colors.border)
      .fillColor("#fff")
      .font("Helvetica-Bold")
      .fontSize(10);

    cols.forEach((c, i) => doc.text(c, pos[i], y + 7));
  };

  let y = doc.y;
  drawHeader(y);
  y += 28;
  doc.font("Helvetica").fontSize(9).fillColor(colors.dark);

  // === TABLE BODY ===
  members.forEach((m, i) => {
    const bg = i % 2 === 0 ? colors.light : colors.accent;
    doc.rect(50, y - 2, usableWidth, 18).fillAndStroke(bg, colors.border);

    const gender = m.gender?.toLowerCase() === "female" ? "F" : "M";

    doc
      .fillColor(colors.dark)
      .text(String(i + 1), pos[0], y)
      .text(m.fullName || "-", pos[1], y, { width: 130 })
      .text(m.phone || "-", pos[2], y)
      .text(gender, pos[3], y, { width: 30 })
      .text(m.membership?.status || "-", pos[4], y, { width: 50 })
      .text(m.membership?.durationMonths?.toString() || "-", pos[5], y)
      .text(formatDate(m.membership?.endDate), pos[6], y, { width: 60 });

    y += 18;

    // Page break check
    if (y > doc.page.height - 100) {
      doc.addPage();
      y = 80;
      drawHeader(y - 10);
      y += 28;
    }
  });

  // === FOOTER ===
  const footerY = doc.page.height - 70;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(colors.dark)
    .text(`Total Members Listed: ${members.length}`, 50, footerY, {
      align: "right",
    });

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(colors.muted)
    .text("Generated by MyGym Management System", 0, doc.page.height - 50, {
      align: "center",
    })
    .text(
      `© ${new Date().getFullYear()} MyGym Fitness Center`,
      0,
      doc.page.height - 38,
      { align: "center" }
    );

  doc.end();
});
