import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Create an axios instance for cleaner API calls
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // This is important for sending cookies
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // The payload to send to the backend
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      // Making the API call using the 'api' instance
      const res = await api.post("/api/auth/signIn", payload);

      console.log(res.data);
      // Navigate to the homepage on successful sign-in
      navigate("/homepage");

    } catch (error) {
      console.error("Sign In Failed:", error?.response?.data || error.message);
      // You can add more user-friendly error handling here, like a state for an error message
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(3,3,3)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-[rgb(10,10,10)] rounded-md border border-[rgb(10,10,10)] py-7 px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#57bfee] mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-[#a6a6a6]">
            Sign in to your TutorConnect account
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-white text-sm font-semibold mb-3"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@gmail.com"
              className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57bfee] focus:border-transparent transition-colors"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-white text-sm font-semibold mb-3"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57bfee] focus:border-transparent transition-colors"
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-[#57bfee] text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#4ab0e0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#57bfee] focus:ring-offset-2 focus:ring-offset-black"
          >
            Sign In
          </button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[rgb(10,10,10)] text-gray-400">or</span>
            </div>
          </div>
          <button
            type="button"
            // onClick={handleGoogleClick}
            className="w-full bg-white text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black flex items-center justify-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-google"
            >
              <path d="M22 12h-1c0-4.97-4.03-9-9-9-4.97 0-9 4.03-9 9s4.03 9 9 9c3.96 0 7.37-2.58 8.5-6h-1.5c-1.12 2.05-3.32 3.5-7 3.5-3.87 0-7-3.13-7-7s3.13-7 7-7c3.87 0 7 3.13 7 7v1h-1"></path>
            </svg>
            Sign in with Google
          </button>
        </div>
        <div className="text-center mt-8">
          <p className="text-[#a6a6a6]">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/sigin")}
              className="text-[#57bfee] hover:text-[#4ab0e0] font-medium transition-colors"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
