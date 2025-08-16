import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", formData);
  };

  return (
    <div className="min-h-screen bg-[rgb(250,250,255)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl border py-8 px-6 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to your StudyBuddy account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
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
              className="w-full px-4 py-3 bg-[rgb(250,250,255)] border border-gray-700 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(136,134,237)] focus:border-transparent transition-colors"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
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
              className="w-full px-4 py-3 bg-[rgb(250,250,255)] border border-gray-700 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(136,134,237)] focus:border-transparent transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[rgb(136,134,237)] text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-[rgb(116,114,217)] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(136,134,237)] focus:ring-offset-2"
          >
            Sign In
          </button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>
          {/* <button
            type="button"
            className="w-full bg-white text-gray-800 py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors border border-gray-700 flex items-center justify-center gap-3"
          >
            <FcGoogle size={24} />
            Sign in with Google
          </button> */}
        </form>
        <div className="text-center mt-8">
          <p className="text-gray-500">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[rgb(136,134,237)] hover:text-[rgb(116,114,217)] font-medium transition-colors"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
