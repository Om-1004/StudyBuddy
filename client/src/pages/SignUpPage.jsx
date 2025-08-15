import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import { app } from '../firebase';
import api from '../axios/axios';
export default function SignUpForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up attempted with:', formData);
  };

  const handleGoogleClick = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;


      const payload = {
        username: user?.displayName,
        email: user?.email
      };

      console.log(payload)

      // const res = await api.post('/api/auth/google', payload);
      console.log('Backend response:', res.data);

    } catch (error) {
      if (error?.code !== 'auth/cancelled-popup-request') {
        console.error('Google error is:', error);
      }
    }
  };


  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
            Welcome
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            Create your TMU TutorConnect account
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-white text-sm font-medium mb-3">
              Username
            </label>
            <input
              type="username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="your_username"
              className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-3">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@torontomu.ca"
              className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-3">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-3">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-cyan-400 text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-cyan-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
          >
            Sign Up
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-gray-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full bg-white text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black flex items-center justify-center gap-3"
          >
            <FcGoogle size={24} />
            Sign up with Google
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-300">
            Already have an account?{' '}
            <button className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
