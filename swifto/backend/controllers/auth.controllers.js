import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import sendOTPMail from "../utils/mail.js"

export const signUp=async (req,res) => {
    try {
        const {fullName,email,password,mobile,role}=req.body
        // console.log(req.body)
        let user=await User.findOne({email})
        if(user){
            return res.status(400).json({message:"User Already exist."})
        }
        if(password.length<6){
            return res.status(400).json({message:"password must be at least 6 characters."})
        }
        if(mobile.length<10){
            return res.status(400).json({message:"mobile no must be at least 10 digits."})
        }
     
        const hashedPassword=await bcrypt.hash(password,10)
        user=await User.create({
            fullName,
            email,
            role,
            mobile,
            password:hashedPassword
        })

        const token=await genToken(user._id)
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
  
        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json(`sign up error ${error}`)
    }
}

export const signIn=async (req,res) => {
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User does not exist."})
        }
        
     const isMatch=await bcrypt.compare(password,user.password)
     if(!isMatch){
         return res.status(400).json({message:"incorrect Password"})
     }

        const token=await genToken(user._id)
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
  
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json(`sign In error ${error}`)
    }
}

export const signOut=async (req,res) => {
    try {
        res.clearCookie("token")
return res.status(200).json({message:"log out successfully"})
    } catch (error) {
        return res.status(500).json(`sign out error ${error}`)
    }
}

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }  
        // Generate OTP
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        const OTPExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
        user.resetOTP = OTP;
        user.OTPExpires = Date.now() + 5 * 60 * 1000;
        await user.save();
        // Send OTP via email
        await sendOTPMail(email, OTP);
        return res.status(200).json({ message: "OTP sent to email." });
    } catch (error) {
        return res.status(500).json({ message: "Error sending OTP." });
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, OTP } = req.body;
        const user = await User.findOne({ email });
        if (user.resetOTP !== OTP) {
            return res.status(400).json({ message: "Invalid OTP." });
        }
        if (user.OTPExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired." });
        }
        user.isOTPVerified = true;
        await user.save();
        return res.status(200).json({ message: "OTP verified." });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying OTP." });
    }   
}

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }       
        if (!user.isOTPVerified) {
            return res.status(400).json({ message: "OTP not verified." });
        }   
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOTP = undefined;
        user.isOTPVerified = false;
        user.OTPExpires = undefined;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Error resetting password." });
    }       
}

export const googleAuth=async (req,res) => {
    try {
        const {fullName,email,role,mobile}=req.body
        let user=await User.findOne({email})
        if(!user){
            user=await User.create({
                fullName,
                email,
                role,
                mobile
            })
        }
        const token=await genToken(user._id)
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json(`google auth error ${error}`)
    }
}