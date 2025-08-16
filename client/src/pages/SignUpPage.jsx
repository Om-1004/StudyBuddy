import React, { useState } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import api from "../axios/axios";
import { useNavigate, Link } from "react-router-dom";

// ---- Static Data ----
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
  "York University",
];

const years = ["Freshman", "Sophomore", "Junior", "Senior"];
const studyLocations = ["Coffee Shop", "Library", "Study Room", "Online"];

const InputField = ({ label, type = "text", name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-gray-500 text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                 text-gray-700 placeholder-gray-400 focus:outline-none 
                 focus:ring-2 focus:ring-[rgb(136,134,237)] focus:border-transparent 
                 transition-colors"
    />
  </div>
);

// ---- Main Component ----
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
  const [currentCourse, setCurrentCourse] = useState("");
  const navigate = useNavigate();

  // ---- Handlers ----
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "university") {
      setFormData((prev) => ({
        ...prev,
        university: value,
        otherUniversity: value === "Other" ? prev.otherUniversity : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
    const payload = { ...rest, university: resolvedUniversity };

    try {
      const res = await api.post("/api/auth/signUp", payload);
      console.log(res.data);
      navigate("/signin");
    } catch (error) {
      console.error("Sign Up Failed:", error?.response?.data || error.message);
    }
  };

  // ---- Validation ----
  const isAccountStepValid = () => {
    const basic =
      formData.fullname.trim() &&
      formData.username.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.confirmPassword;
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
        if (formData.university === "Other" && !formData.otherUniversity.trim()) return false;
        return formData.major.trim() && formData.year && formData.location;
      default:
        return false;
    }
  };

  // ---- Step UI ----
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <InputField
              label="Full Name"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              placeholder="Your full name"
            />
            <InputField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Your username"
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@domain.ca"
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            <div>
              <InputField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">Passwords do not match.</p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <label className="block text-gray-500 text-sm font-medium mb-2">
              Tell us about yourself
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Write a brief bio..."
              rows={5}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                         text-gray-700 placeholder-gray-400 focus:outline-none 
                         focus:ring-2 focus:ring-[rgb(136,134,237)] focus:border-transparent 
                         transition-colors resize-none"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {formData.courses.map((course, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
              >
                <p className="text-gray-700">{course}</p>
                <button
                  onClick={() => removeCourse(idx)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={currentCourse}
                onChange={(e) => setCurrentCourse(e.target.value)}
                placeholder="Course name"
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg 
                           text-gray-700 placeholder-gray-400 focus:outline-none 
                           focus:ring-2 focus:ring-[rgb(136,134,237)] focus:border-transparent"
              />
              <button
                onClick={addCourse}
                disabled={!currentCourse.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-[rgb(136,134,237)] text-white 
                           rounded-lg font-medium hover:bg-[rgb(116,114,217)] 
                           disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-500 text-sm font-medium mb-2">University</label>
              <select
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700"
              >
                <option value="">Select your university</option>
                {canadianUniversities.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
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
                  className="mt-2 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700"
                />
              )}
            </div>

            <InputField
              label="Major"
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              placeholder="e.g., Computer Engineering"
            />

            <div>
              <label className="block text-gray-500 text-sm font-medium mb-2">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700"
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-500 text-sm font-medium mb-2">Study Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700"
              >
                <option value="">Select location</option>
                {studyLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ---- Step Titles/Descriptions ----
  const stepTitles = [
    "Create your account",
    "Tell us about yourself",
    "Courses you’re taking",
    "Your university & study info",
  ];
  const stepDescriptions = [
    "Create your StudyBuddy account",
    "Help others get to know you better",
    "List the courses you’re currently taking",
    "Add your university, major, year, and preferred study location",
  ];

  return (
    <div className="min-h-screen bg-[rgb(250,250,255)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="text-[rgb(136,134,237)] hover:text-[rgb(116,114,217)] transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <div className="flex-1" />
            <div className="text-gray-400 text-sm">Step {currentStep + 1} of 4</div>
          </div>
          <h1 className="text-3xl font-bold text-[rgb(136,134,237)] mb-2">
            {stepTitles[currentStep]}
          </h1>
          <p className="text-gray-500">{stepDescriptions[currentStep]}</p>
        </div>

        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-[rgb(136,134,237)] h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}

        <div className="mt-8">
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="w-full bg-[rgb(136,134,237)] text-white py-3 px-6 rounded-lg 
                         font-semibold text-lg hover:bg-[rgb(116,114,217)] 
                         disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed 
                         transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="w-full bg-[rgb(136,134,237)] text-white py-3 px-6 rounded-lg 
                         font-semibold text-lg hover:bg-[rgb(116,114,217)] 
                         disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed 
                         transition-colors"
            >
              Complete Registration
            </button>
          )}
        </div>

        {currentStep === 0 && (
          <div className="text-center mt-6">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-[rgb(136,134,237)] hover:text-[rgb(116,114,217)] font-medium"
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
