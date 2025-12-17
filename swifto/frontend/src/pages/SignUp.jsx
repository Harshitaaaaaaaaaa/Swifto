import React, { use } from 'react'
import { useState } from 'react';
import { EyeIcon, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App.jsx';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "../../firebase.js";

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSignUp = async () => {
        try {
            console.log({fullName, email, password, mobile, role})
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullName, email, password, mobile, role
            }, { withCredentials: true })
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGoogleAuth = async () => {
        if (!mobile) {
            return setErr("mobile no is required")
        }
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
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
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your Full Name"
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullName}
                        required
                    />
                </div>

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
                    <label>Mobile</label>
                    <input
                        type="email"
                        placeholder="Enter your Mobile Number"
                        onChange={(e) => setMobile(e.target.value)}
                        value={mobile}
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

                        <button onClick={() => setShowPassword(prev => !prev)}>
                            {!showPassword ? <EyeOff/> : <EyeIcon/> }
                        </button>
                    </div>
                </div>

                <div>
                    <label>Role</label>
                    <div>
                        {["user", "owner", "deliveryBoy"].map((r) => (
                            <div>
                                
                            <button
                            key={r}
                                onClick={() => setRole(r)}
                                >
                                {r}
                            </button>
                                </div>
                        ))}
                    </div>
                </div>

                <div>

                <button 
                onClick={handleSignUp} 
                // disabled={loading}
                >
                    Sign Up
                </button>
                    </div>

                {/* {err && <p>*{err}</p>} */}

                <button 
                onClick={handleGoogleAuth}
                >
                    <span>Sign up with Google</span>  
                </button>

                <p onClick={() => navigate("/signin")}>
                    Already have an account? <span>Sign In</span>
                </p>
            </div>
        </div>
    )
}

export default SignUp
