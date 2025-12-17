import React from "react";
import { useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App.jsx";
import axios from "axios";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      console.log({ email });
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        {
          email,
        },
        { withCredentials: true }
      );
      console.log(result.data);
      setStep(2);
    } catch (error) {
      console.log("FRONTEND ERROR:", error.response?.data);
      console.log("BACKEND MESSAGE:", error.response?.data?.message);
      console.log("BACKEND ERROR DETAIL:", error.response?.data?.error);
    }
  };
  const handleVerifyOTP = async () => {
    try {
      console.log({ OTP });
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        {
            email,
          OTP,
        },
        { withCredentials: true }
      );
      console.log(result.data);
      setStep(3);
    } catch (error) {
      console.log("FRONTEND ERROR:", error.response?.data);
      console.log("BACKEND MESSAGE:", error.response?.data?.message);
      console.log("BACKEND ERROR DETAIL:", error.response?.data?.error);
    }
  };
  const handleResetPassword = async () => {
    try {
      console.log({ password, confirmPassword });
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        {
          email,
          newPassword: password,
        },
        { withCredentials: true }
      );
      console.log(result.data);
    } catch (error) {
      console.log("FRONTEND ERROR:", error.response?.data);
      console.log("BACKEND MESSAGE:", error.response?.data?.message);
      console.log("BACKEND ERROR DETAIL:", error.response?.data?.error);
    }
  };

  return (
    <div>
      <div>
        <h1>Vingo</h1>
        <p>bhulaaaaaa</p>

        <div
          onClick={() => {
            navigate("/signin");
          }}
        >
          back
        </div>
        {step == 1 && (
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <div>
              <button
                onClick={() => handleSendOTP()}
                // disabled={loading}
              >
                send otp
              </button>
            </div>
          </div>
        )}

        {step == 2 && (
          <div>
            <label>otp</label>
            <div>
              <input
                placeholder="Enter otp"
                onChange={(e) => setOTP(e.target.value)}
                value={OTP}
                required
              />
            </div>
            <div>
              <button
                onClick={() => handleVerifyOTP()}
                // disabled={loading}
              >
                verify otp
              </button>
            </div>
          </div>
        )}
        {step == 3 && (
          <div>
            <label>Password</label>
            <div>
              <input
                type={show ? "text" : "password"}
                placeholder="Enter new password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />

              <button onClick={() => setShow((prev) => !prev)}>
                {!show ? <EyeOff /> : <EyeIcon />}
              </button>
            </div>

            <label>confirm Password</label>
            <div>
              <input
                type={show ? "text" : "password"}
                placeholder="confrim password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />

              <button onClick={() => setShowConfirm((prev) => !prev)}>
                {!showConfirm ? <EyeOff /> : <EyeIcon />}
              </button>
            </div>
            <div>
              <button
                onClick={() => handleResetPassword()}
                // disabled={loading}
              >
                set password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
