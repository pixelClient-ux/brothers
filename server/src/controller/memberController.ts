import ApiFeature from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

import Member from "../model/memberModel.js";
import { newMemberTemplate } from "../utils/newMemberTemplate.js";
import sendEmail from "../utils/sendEmail.js";
import dotenv from "dotenv";
import { renewMemberTemplate } from "../utils/renewMemberTemplate.js";
import { generateMembershipCard } from "../utils/generateMembershipCard.js";
import cloudinary from "../config/cloudinary.js";
dotenv.config();

export const createMember = catchAsync(async (req, res, next) => {
  const {
    fullName,
    phone,
    gender,
    durationMonths = 12,
    amount,
    method = "cash",
  } = req.body;

  if (!fullName || !phone || !gender) {
    return next(new AppError("Full name, phone, and gender are required", 400));
  }

  const existingMember = await Member.findOne({ phone });
  if (existingMember) {
    return next(new AppError("Member with this phone already exists", 409));
  }

  const avatar = req.body.avatar
    ? { url: req.body.avatar.url, publicId: req.body.avatar.publicId }
    : { url: "/images/profile.png", publicId: null };
  const member = await Member.create({
    fullName: fullName.trim(),
    phone: phone.trim(),
    gender,
    avatar: avatar || "/images/profile.png",
  });

  const monthsToAdd = Number(durationMonths);
  const paymentAmount = Number(amount);

  await member.renewMembership(monthsToAdd, paymentAmount, method);

  const pdfBuffer = await generateMembershipCard(member);

  const adminEmail = process.env.EMAIL_USERNAME;

  if (adminEmail) {
    await sendEmail({
      email: adminEmail,
      subject: `New Member: ${member.fullName} (${member.memberCode})`,
      html: newMemberTemplate({
        fullName: member.fullName,
        phone: member.phone,
        gender: member.gender,
        memberCode: member.memberCode,
        startDate: member.membership!.startDate!,
        endDate: member.membership!.endDate!,
        durationMonths: member.membership!.durationMonths!,
        amount: paymentAmount,
        method,
      }),
      attachments: [
        {
          filename: `${member.memberCode}_membership_card.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
  }

  res.status(201).json({
    status: "success",
    message: "Member created and membership activated successfully",
    data: {
      member,
      cardGenerated: true,
      emailSent: !!adminEmail,
    },
  });
});

export const getDashboardStats = catchAsync(async (req, res, next) => {
  // === 1. Total Members ===
  const totalMembers = await Member.countDocuments();

  // === 2. Active Members ===
  const activeMembers = await Member.countDocuments({
    "membership.status": "active",
    isActive: true,
  });

  // === 3. New Members in Range ===
  const newMembersFeature = new ApiFeature(Member.find(), req.query).range();
  const newMembers = await newMembersFeature.query.countDocuments();

  // === 4. Total Revenue in Range ===
  const revenueFeature = new ApiFeature(Member.find(), req.query).range();
  const revenueMembers = await revenueFeature.query;
  const totalRevenue = revenueMembers.reduce((sum, m) => {
    const lastPayment = m.payments?.[m.payments.length - 1];
    return sum + (lastPayment?.amount || 0);
  }, 0);

  // === 5. Monthly New Members (Last 12 Months) ===
  const monthlyAggregation = await Member.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return d.toISOString().slice(0, 7);
  });

  const monthlyMembers = last12Months.map((month) => ({
    month,
    count: monthlyAggregation.find((m: any) => m._id === month)?.count || 0,
  }));

  // === 6. Status Breakdown ===
  const statusCounts = await Member.aggregate([
    { $group: { _id: "$membership.status", count: { $sum: 1 } } },
  ]);

  const status = {
    active: statusCounts.find((s: any) => s._id === "active")?.count || 0,
    expired: statusCounts.find((s: any) => s._id === "expired")?.count || 0,
    inactive: statusCounts.find((s: any) => s._id === "inactive")?.count || 0,
  };

  // === 7. Gender Breakdown ===
  const genderCounts = await Member.aggregate([
    { $group: { _id: "$gender", count: { $sum: 1 } } },
  ]);

  const gender = {
    male: genderCounts.find((g: any) => g._id === "male")?.count || 0,
    female: genderCounts.find((g: any) => g._id === "female")?.count || 0,
    other: genderCounts.find((g: any) => g._id === "other")?.count || 0,
  };

  res.status(200).json({
    status: "success",
    data: {
      totalMembers,
      activeMembers,
      newMembers,
      totalRevenue,
      monthlyMembers,
      status,
      gender,
    },
  });
});
export const getMemebrs = catchAsync(async (req, res, next) => {
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

export const getMemebrDetails = catchAsync(async (req, res, next) => {
  console.log("Fetching member details for code:", req.params.memberCode);
  const { memberCode } = req.params;
  const member = await Member.findOne({ memberCode });
  if (!member) {
    return next(new AppError("Member not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { member },
  });
});

// controller
export const verifyMemberByCode = catchAsync(async (req, res, next) => {
  console.log("Verifying member with code:", req.params.memberCode);
  const { memberCode } = req.params;
  const member = await Member.findOne({ memberCode }).select(
    "+membership.status"
  );

  if (!member || member.membership?.status === "expired") {
    return res.status(200).json({
      status: "success",
      data: { member: null },
    });
  }

  res.status(200).json({
    status: "success",
    data: { member },
  });
});
export const updateMember = catchAsync(async (req, res, next) => {
  const { memberId } = req.params;

  const allowedFields = [
    "fullName",
    "phone",
    "gender",
    "avatar",
    "durationMonths",
    "amount",
    "method",
  ];

  /** Filter allowed fields */
  const filteredData: Record<string, any> = {};
  for (const key of Object.keys(req.body)) {
    if (allowedFields.includes(key)) {
      filteredData[key] = req.body[key];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    return next(new AppError("No valid fields provided for update", 400));
  }

  /** Find Member */
  const member = await Member.findById(memberId);
  if (!member) return next(new AppError("Member not found", 404));

  /** 🔥 1. Handle avatar update (Cloudinary) */
  if (filteredData.avatar) {
    // Delete old avatar only if it exists
    if (member.avatar?.publicId) {
      await cloudinary.uploader.destroy(member.avatar.publicId);
    }

    member.avatar = {
      url: filteredData.avatar.url,
      publicId: filteredData.avatar.publicId,
    };
  }

  /** 🔥 2. Update basic fields */
  if (filteredData.fullName) member.fullName = filteredData.fullName;
  if (filteredData.phone) member.phone = filteredData.phone;
  if (filteredData.gender) member.gender = filteredData.gender;

  /** 🔥 3. Update membership info */
  if (filteredData.durationMonths && member.membership) {
    const months = parseInt(filteredData.durationMonths);
    member.membership.durationMonths = months;

    if (member.membership.startDate) {
      const start = new Date(member.membership.startDate);
      const newEnd = new Date(start);
      newEnd.setMonth(start.getMonth() + months);
      member.membership.endDate = newEnd;

      const today = new Date();
      if (newEnd > today) {
        member.membership.status = "active";
        member.isActive = true;
      } else {
        member.membership.status = "expired";
        member.isActive = false;
      }
    }
  }

  /** 🔥 4. Update last payment info */
  if (filteredData.amount || filteredData.method) {
    const lastPayment = member.payments[member.payments.length - 1];
    if (lastPayment) {
      if (filteredData.amount)
        lastPayment.amount = parseFloat(filteredData.amount);
      if (filteredData.method) lastPayment.method = filteredData.method;
    }
  }

  /** Save updates */
  await member.save();

  res.status(200).json({
    status: "success",
    message: "Member updated successfully",
    data: member,
  });
});

export const renewMembership = catchAsync(async (req, res, next) => {
  const { memberId } = req.params;
  const { months, amount, method } = req.body;
  console.log(months, amount, method);
  if (!months || months <= 0)
    return next(new AppError("Please provide valid months.", 400));
  if (!amount || amount <= 0)
    return next(new AppError("Please provide valid amount.", 400));

  const member = await Member.findById(memberId);
  if (!member) return next(new AppError("Member not found.", 404));

  const updateMember = await member.renewMembership(
    Number(months),
    amount,
    method
  );
  if (!member.membership || !member.membership.endDate) {
    return next(
      new AppError("Member does not have an active membership.", 400)
    );
  }

  if (!updateMember.membership?.endDate) {
    return next(
      new AppError("Member does not have an active membership.", 400)
    );
  }

  const oldEndDate = new Date(member.membership.endDate);
  const adminEmail = process.env.EMAIL_USERNAME;
  if (adminEmail) {
    const html = renewMemberTemplate({
      fullName: updateMember.fullName,
      phone: updateMember.phone,
      gender: updateMember.gender,
      oldEndDate,
      newEndDate: updateMember.membership.endDate,
      addedMonths: months,
      totalPaid: amount,
      method,
    });

    await sendEmail({
      email: adminEmail,
      subject: `Membership Renewed: ${updateMember.fullName}`,
      html,
    });
  }
  res.status(200).json({
    status: "success",
    message: `Membership renewed for ${months} month(s)`,
    data: updateMember,
  });
});

export const deleteMember = catchAsync(async (req, res, next) => {
  const { memberId } = req.params;

  // Find member
  const member = await Member.findById(memberId);

  if (!member) {
    return next(new AppError("No member found with that ID", 404));
  }
  if (member.avatar?.publicId) {
    try {
      await cloudinary.uploader.destroy(member.avatar.publicId);
    } catch (err) {
      console.warn("Failed to delete Cloudinary image on member delete:", err);
    }
  }

  // Mark as deleted (soft delete)
  member.isDeleted = true;
  member.deletedAt = new Date();
  member.isActive = false;

  await member.save();

  res.status(200).json({
    status: "success",
    message: "Member removed successfully",
  });
});
