import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import { app } from '../firebase';
import api from '../axios/axios';

console.log(api)
export default function SignUpTutor() {
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    courses: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
        
    } catch (error) {
        
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
            <label htmlFor="Bio" className="block text-white text-sm font-medium mb-3">
              Bio
            </label>
            <input
              type="text"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="your_bio"
              className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-white text-sm font-medium mb-3">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="your_location"
              className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="courses" className="block text-white text-sm font-medium mb-3">
              Password
            </label>
            <input
              type="text"
              id="courses"
              name="courses"
              value={formData.courses}
              onChange={handleInputChange}
              placeholder="Enter courses"
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

    
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-300">
            Already have an account?{' '}
            <button className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
