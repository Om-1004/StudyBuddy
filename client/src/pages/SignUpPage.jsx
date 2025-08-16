import React, { useState } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import api from "../axios/axios";
import { useNavigate, Link } from "react-router-dom";

const canadianUniversities = [
  "Acadia University",
  "Algoma University",
  "Athabasca University",
  "Bishop's University",
  "Brandon University",
  "Brock University",
  "Cape Breton University",
  "Carleton University",
  "Canadian Mennonite University",
  "Concordia University",
  "Concordia University of Edmonton",
  "Dalhousie University",
  "École de technologie supérieure (ETS)",
  "Emily Carr University of Art and Design",
  "First Nations University of Canada",
  "HEC Montréal",
  "Kwantlen Polytechnic University",
  "Lakehead University",
  "Laurentian University",
  "MacEwan University",
  "McGill University",
  "McMaster University",
  "Memorial University of Newfoundland",
  "Mount Allison University",
  "Mount Royal University",
  "Mount Saint Vincent University",
  "Nipissing University",
  "OCAD University",
  "Polytechnique Montréal",
  "Queen's University",
  "Royal Roads University",
  "Simon Fraser University",
  "St. Francis Xavier University",
  "St. Thomas University",
  "Thompson Rivers University",
  "Toronto Metropolitan University (TMU)",
  "Trent University",
  "Université de Montréal",
  "Université de Moncton",
  "Université de Sherbrooke",
  "Université Laval",
  "Université Sainte-Anne",
  "University of Alberta",
  "University of British Columbia",
  "University of Guelph",
  "University of Manitoba",
  "University of New Brunswick",
  "University of Northern British Columbia",
  "University of Ottawa",
  "University of Prince Edward Island",
  "University of Regina",
  "University of Saskatchewan",
  "University of Toronto",
  "University of Victoria",
  "University of Waterloo",
  "University of Winnipeg",
  "Western University",
  "Wilfrid Laurier University",
  "York University"
]


const years = ["Freshman", "Sophomore", "Junior", "Senior"];
const studyLocations = ["Coffee Shop", "Library", "Study Room", "Online"];

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    courses: [],
    university: "",
    otherUniversity: "",
    major: "",
    year: "",
    location: "",
  });

  const navigate = useNavigate();
  const [currentCourse, setCurrentCourse] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "university") {
      setFormData((prev) => ({
        ...prev,
        university: value,
        otherUniversity: value === "Other" ? prev.otherUniversity : "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addCourse = () => {
    if (currentCourse.trim()) {
      setFormData((prev) => ({
        ...prev,
        courses: [...prev.courses, currentCourse.trim()],
      }));
      setCurrentCourse("");
    }
  };

  const removeCourse = (index) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => setCurrentStep((s) => s + 1);
  const handleBack = () => setCurrentStep((s) => s - 1);

  const handleSubmit = async () => {
  const resolvedUniversity =
    formData.university === "Other"
      ? formData.otherUniversity.trim()
      : formData.university;

  const { otherUniversity, ...rest } = formData;
  const payload = {
    ...rest,
    university: resolvedUniversity,
    major: formData.major,     
    year: formData.year,     
    location: formData.location,
  };

  try {
    const res = await api.post("/api/auth/signUp", payload);
    console.log(res.data);
    navigate("/homepage");
  } catch (error) {
    console.log("Sign Up Failed:", error?.response?.data || error.message);
  }
};


  const isAccountStepValid = () => {
    const basic =
      formData.fullname.trim() &&
      formData.username.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.confirmPassword;
      formData.major.trim() &&
      formData.year &&
      formData.location
    const pwMatch = formData.password === formData.confirmPassword;
    return Boolean(basic && pwMatch);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return isAccountStepValid();
      case 1:
        return formData.bio.trim().length > 0;
      case 2:
        return formData.courses.length > 0;
      case 3:
        if (!formData.university) return false;
        if (formData.university === "Other" && !formData.otherUniversity.trim())
          return false;
        if (!formData.major.trim() || !formData.year || !formData.location)
          return false;
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Account Info */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Your username"
                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@domain.ca"
                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              />
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2">
                    Passwords do not match.
                  </p>
                )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            {/* Bio */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Tell us about yourself
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Write a brief bio..."
                rows={6}
                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors resize-none"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Courses */}
            <h3 className="text-white text-lg font-medium mb-4">
              What courses are you taking?
            </h3>
            {formData.courses.map((course, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-900 p-4 rounded-lg"
              >
                <p className="text-white">{course}</p>
                <button
                  onClick={() => removeCourse(idx)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <div className="space-y-4 mt-4">
              <input
                type="text"
                value={currentCourse}
                onChange={(e) => setCurrentCourse(e.target.value)}
                placeholder="Course name"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              />
              <button
                onClick={addCourse}
                disabled={!currentCourse.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black rounded-lg font-medium hover:bg-cyan-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={18} /> Add Course
              </button>
            </div>
          </div>
        );

      case 3:
  return (
    <div className="space-y-6">
      {/* University */}
      <div>
        <label htmlFor="university" className="block text-white text-sm font-medium mb-3">
          University
        </label>
        <select
          id="university"
          name="university"
          value={formData.university}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
          required
        >
          <option value="">Select your university</option>
          {canadianUniversities.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
          <option value="Other">Other</option>
        </select>
        {formData.university === "Other" && (
          <input
            type="text"
            name="otherUniversity"
            value={formData.otherUniversity}
            onChange={handleInputChange}
            placeholder="Type your university"
            className="mt-2 w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          />
        )}
      </div>

      {/* Major */}
      <div>
        <label htmlFor="major" className="block text-white text-sm font-medium mb-2">
          Major
        </label>
        <input
          type="text"
          id="major"
          name="major"
          value={formData.major}
          onChange={handleInputChange}
          placeholder="e.g., Computer Engineering"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          required
        />
      </div>

      {/* Year */}
      <div>
        <label htmlFor="year" className="block text-white text-sm font-medium mb-2">
          Year
        </label>
        <select
          id="year"
          name="year"
          value={formData.year}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
        >
          <option value="">Select year</option>
          <option value="Freshman">Freshman</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      {/* Study Location */}
      <div>
        <label htmlFor="location" className="block text-white text-sm font-medium mb-2">
          Study Location
        </label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          required
        >
          <option value="">Select location</option>
          <option value="Coffee Shop">Coffee Shop</option>
          <option value="Library">Library</option>
          <option value="Study Room">Study Room</option>
          <option value="Online">Online</option>
        </select>
      </div>
    </div>
  );


      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Create your account";
      case 1:
        return "Tell us about yourself";
      case 2:
        return "Courses you’re taking";
      case 3:
        return "Your university & study info";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 0:
        return "Create your TMU TutorConnect account";
      case 1:
        return "Help others get to know you better";
      case 2:
        return "List the courses you’re currently taking";
      case 3:
        return "Add your university, major, year, and preferred study location";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <div className="flex-1" />
            <div className="text-gray-400 text-sm">Step {currentStep + 1} of 4</div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
            {getStepTitle()}
          </h1>
          <p className="text-gray-300 text-base md:text-lg">{getStepDescription()}</p>
        </div>

        <div className="mb-8">
          <div className="bg-gray-800 rounded-full h-2">
            <div
              className="bg-cyan-400 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}

        <div className="mt-8">
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="w-full bg-cyan-400 text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-cyan-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="w-full bg-cyan-400 text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-cyan-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Complete Registration
            </button>
          )}
        </div>

        {currentStep === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-300">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
