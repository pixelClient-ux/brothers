// controllers/verificationController.ts
import { catchAsync } from "../utils/catchAsync.js";
import Member from "../model/memberModel.js";

export const verifyMember = catchAsync(async (req, res) => {
  const { code } = req.params;
  const member = await Member.findOne({ memberCode: code, isDeleted: false });

  if (!member || member.daysLeft <= 0 || !member.isActive) {
    return res.json({
      valid: false,
      message: "Access denied. Membership expired or invalid.",
    });
  }

  res.json({
    valid: true,
    member: {
      fullName: member.fullName,
      avatar: member.avatar || "/images/profile.png",
      memberCode: member.memberCode,
      daysLeft: member.daysLeft,
      endDate: member.membership?.endDate,
      phone: member.phone,
    },
  });
});
