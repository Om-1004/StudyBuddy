import React, { useState } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import api from "../axios/axios";
import { useNavigate, Link } from "react-router-dom";

const canadianUniversities = [
  "University of Alberta",
  "University of Calgary",
  "University of Lethbridge",
  "Athabasca University",
  "MacEwan University",
  "Mount Royal University",
  "Concordia University of Edmonton",
  "University of British Columbia",
  "Simon Fraser University",
  "University of Victoria",
  "Thompson Rivers University",
  "University of Northern British Columbia",
  "Royal Roads University",
  "Capilano University",
  "Kwantlen Polytechnic University",
  "Emily Carr University of Art and Design",
  "Vancouver Island University",
  "University of Manitoba",
  "University of Winnipeg",
  "Brandon University",
  "Canadian Mennonite University",
  "University of New Brunswick",
  "St. Thomas University",
  "Mount Allison University",
  "Université de Moncton",
  "Memorial University of Newfoundland",
  "Dalhousie University",
  "Saint Mary's University",
  "Acadia University",
  "Cape Breton University",
  "St. Francis Xavier University",
  "Mount Saint Vincent University",
  "Université Sainte-Anne",
  "University of Toronto",
  "York University",
  "Toronto Metropolitan University (TMU)",
  "OCAD University",
  "University of Ottawa",
  "Carleton University",
  "Queen's University",
  "Western University",
  "University of Waterloo",
  "Wilfrid Laurier University",
  "McMaster University",
  "Brock University",
  "Laurentian University",
  "Lakehead University",
  "Nipissing University",
  "Trent University",
  "University of Guelph",
  "University of Windsor",
  "Algoma University",
  "University of Prince Edward Island",
  "McGill University",
  "Concordia University",
  "Université de Montréal",
  "Université Laval",
  "Université de Sherbrooke",
  "École de technologie supérieure (ETS)",
  "Polytechnique Montréal",
  "HEC Montréal",
  "Bishop's University",
  "University of Saskatchewan",
  "University of Regina",
  "First Nations University of Canada",
];

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
  });
  
  const navigate = useNavigate()

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
    const payload = { ...rest, university: resolvedUniversity };

    try {
      const res = await api.post('/api/auth/signUp', payload);
      console.log(res.data);
      navigate('/homepage');

    } catch (error) {
      console.log(error?.response?.data || error.message);
    }
  };

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
      case 3: {
        if (!formData.university) return false;
        if (formData.university === "Other") {
          return formData.otherUniversity.trim().length > 0;
        }
        return true;
      }
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="fullname"
                className="block text-white text-sm font-medium mb-3"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="your_fullname"
                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-white text-sm font-medium mb-3"
              >
                Username
              </label>
              <input
                type="text"
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
              <label
                htmlFor="email"
                className="block text-white text-sm font-medium mb-3"
              >
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
              <label
                htmlFor="password"
                className="block text-white text-sm font-medium mb-3"
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
                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-white text-sm font-medium mb-3"
              >
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
            <div>
              <label
                htmlFor="bio"
                className="block text-white text-sm font-medium mb-3"
              >
                Tell us about yourself
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Write a brief bio about your experience and interests..."
                rows={6}
                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors resize-none"
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                This will be shown on your profile.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-white text-lg font-medium mb-4">
                What courses are you taking?
              </h3>

              {formData.courses.length > 0 && (
                <div className="space-y-3 mb-6">
                  {formData.courses.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-900 p-4 rounded-lg"
                    >
                      <p className="text-white font-medium">{course}</p>
                      <button
                        onClick={() => removeCourse(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        aria-label={`Remove ${course}`}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="courseName"
                    className="block text-white text-sm font-medium mb-2"
                  >
                    Course Name
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    value={currentCourse}
                    onChange={(e) => setCurrentCourse(e.target.value)}
                    placeholder="e.g., CPS 109, MTH 140"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={addCourse}
                  disabled={!currentCourse.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black rounded-lg font-medium hover:bg-cyan-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={18} />
                  Add Course
                </button>
              </div>

              {formData.courses.length === 0 && (
                <p className="text-gray-400 text-sm mt-4">
                  Add at least one course to continue.
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="university"
                className="block text-white text-sm font-medium mb-3"
              >
                What university do you attend?
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
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>

              {formData.university === "Other" && (
                <div className="mt-4">
                  <label
                    htmlFor="otherUniversity"
                    className="block text-white text-sm font-medium mb-2"
                  >
                    Enter your university
                  </label>
                  <input
                    type="text"
                    id="otherUniversity"
                    name="otherUniversity"
                    value={formData.otherUniversity}
                    onChange={handleInputChange}
                    placeholder="Type your university name"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
                  />
                </div>
              )}

              <p className="text-gray-400 text-sm mt-2">
                This helps others find you for in-person sessions.
              </p>
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
        return "Your university";
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
        return "Choose your university to help others find you";
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
            <div className="text-gray-400 text-sm">
              Step {currentStep + 1} of 4
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
            {getStepTitle()}
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            {getStepDescription()}
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-gray-800 rounded-full h-2">
            <div
              className="bg-cyan-400 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        <div>
          {renderStep()}

          <div className="mt-8">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="w-full bg-cyan-400 text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-cyan-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="w-full bg-cyan-400 text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-cyan-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
              >
                Complete Registration
              </button>
            )}
          </div>
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
