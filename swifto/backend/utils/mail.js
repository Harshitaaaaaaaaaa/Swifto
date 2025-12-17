import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendOTPMail = async (to, OTP) => {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: "Reset your password - OTP Code",
        html: `<p>Your OTP code is: <strong>${OTP}</strong> valid for 5 minutes.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending otp email:", error);
    }
};

export default sendOTPMail;