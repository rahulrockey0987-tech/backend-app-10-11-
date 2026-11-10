
import crypto from "crypto";
import jwt from "jsonwebtoken";
import OTP from "../models/OTP.js";

const generateOTP = () =>
  crypto.randomInt(100000, 1000000).toString();

const hashOTP = (otp) =>
  crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(otp)
    .digest("hex");

// SEND OTP
export const sendOTP = async (req, res) => {
  try {
    const { mobile, role } = req.body;

    if (!/^[6-9]\d{9}$/.test(mobile || "")) {
      return res.status(400).json({
        success: false,
        message: "Invalid Indian mobile number"
      });
    }

    if (!["customer", "partner"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account role"
      });
    }

    if (!process.env.OTP_SECRET) {
      throw new Error("OTP_SECRET is missing");
    }

    const expiryMinutes = Number(
      process.env.OTP_EXPIRY_MINUTES || 5
    );

    if (!Number.isFinite(expiryMinutes) || expiryMinutes <= 0) {
      throw new Error("Invalid OTP expiry configuration");
    }

    const existing = await OTP.findOne({ mobile, role });

    if (
      existing &&
      Date.now() - existing.lastSentAt.getTime() < 60000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP"
      });
    }

    const otp = generateOTP();

    await OTP.findOneAndUpdate(
      { mobile, role },
      {
        $set: {
          otpHash: hashOTP(otp),
          expiresAt: new Date(
            Date.now() + expiryMinutes * 60 * 1000
          ),
          attempts: 0,
          lastSentAt: new Date()
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    // LOCAL DEVELOPMENT ONLY
    if (process.env.NODE_ENV === "development") {
      console.log("\n================================");
      console.log("       HOMEHELP OTP SYSTEM");
      console.log("================================");
      console.log("Mobile Number :", mobile);
      console.log("Account Role  :", role);
      console.log("Generated OTP :", otp);
      console.log("Expiry        :", expiryMinutes, "minutes");
      console.log("================================\n");
    }

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      expiresIn: expiryMinutes * 60
    });

  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate OTP"
    });
  }
};


// VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { mobile, role, otp } = req.body;

    if (
      !/^[6-9]\d{9}$/.test(mobile || "") ||
      !["customer", "partner"].includes(role) ||
      !/^\d{6}$/.test(otp || "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification details"
      });
    }

    if (
      !process.env.OTP_SECRET ||
      !process.env.OTP_VERIFICATION_SECRET
    ) {
      throw new Error("OTP secrets are missing");
    }

    const record = await OTP.findOne({ mobile, role });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Request a new OTP."
      });
    }

    if (record.expiresAt.getTime() <= Date.now()) {
      await OTP.deleteOne({ _id: record._id });

      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    if (record.attempts >= 5) {
      await OTP.deleteOne({ _id: record._id });

      return res.status(429).json({
        success: false,
        message: "Maximum attempts reached"
      });
    }

    const submittedHash = Buffer.from(hashOTP(otp), "hex");
    const storedHash = Buffer.from(record.otpHash, "hex");

    const valid =
      submittedHash.length === storedHash.length &&
      crypto.timingSafeEqual(submittedHash, storedHash);

    if (!valid) {
      record.attempts += 1;
      await record.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect OTP"
      });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: record._id });

    // Temporary phone verification token.
    // Not a final customer or partner login token.
    const verificationToken = jwt.sign(
      {
        mobile,
        role,
        phoneVerified: true
      },
      process.env.OTP_VERIFICATION_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      success: true,
      message: "Mobile number verified successfully",
      verificationToken
    });

  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });
  }
};
