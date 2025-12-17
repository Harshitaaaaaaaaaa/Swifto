import React, { use } from "react";
import { useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App.jsx";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "../../firebase.js";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      console.log({ email, password, role });
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
          role,
        },
        { withCredentials: true }
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleAuth = async () => {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      try {
          const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
              email: result.user.email,
              role
          }, { withCredentials: true })
          // dispatch(setUserData(data))
      } catch (error) {
          console.log(error)
      }
  }

  return (
    <div>
      <div>
        <h1>Vingo</h1>
        <p>Create your account to get started with delicious food deliveries</p>

        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />

            <button onClick={() => setShowPassword((prev) => !prev)}>
              {!showPassword ? <EyeOff /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div>
          <label>Role</label>
          <div>
            {["user", "owner", "deliveryBoy"].map((r) => (
              <div>

              <button key={r} onClick={() => setRole(r)}>{r}</button>
              </div>
            ))}
          </div>
        </div>

        <div
        onClick={()=>{navigate('/forgot-password')}}
        >
          forgot password?
        </div>

        <div>
          <button
            onClick={handleSignIn}
            // disabled={loading}
          >
            Sign In
          </button>
        </div>

        {/* {err && <p>*{err}</p>} */}

        <button
        onClick={handleGoogleAuth}
        >
          <span>Sign up with Google</span>
        </button>

        <p onClick={() => navigate("/signup")}>
          Don't have an account? <span>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
