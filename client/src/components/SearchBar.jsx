import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const courses = [
  "All courses",
  "Computer Science 101",
  "Data Structures",
  "Calculus I",
  "Physics I",
  "Chemistry I",
  "Biology 101",
  "Psychology 101",
  "Economics 101",
  "Statistics",
  "Linear Algebra",
  "Other",
];

const years = ["All years", "Freshman", "Sophomore", "Junior", "Senior"];
const times = ["All time", "Morning", "Afternoon", "Evening", "Weekend"];

export default function SearchBar() {
  const [openCourse, setOpenCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("All courses");
  const [openYear, setOpenYear] = useState(false);
  const [selectedYear, setSelectedYear] = useState("All years");
  const [openTime, setOpenTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState("All time");

  return (
    <div className="bg-[rgb(243,243,251)] py-5 rounded border mx-4 sm:mx-8 md:mx-16 lg:mx-32 my-8 md:px-5">
      <p className="pl-4 font-bold pb-3 text-md">Find Your Study Buddy</p>

      {/* Search Box */}
      <div className="py-2 bg-[rgb(250,250,255)] text-gray-500 px-3 flex items-center gap-2 text-md rounded hover:bg-gray-100 transition-colors cursor-pointer w-full">
        <Search size={18} />
        <span>Search by name or major</span>
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-4 mt-4">
        {/* Course Dropdown */}
        <div className="relative flex-1 min-w-[200px]">
          <div
            className="py-2 px-3 bg-[#fafaff] text-gray-500 flex items-center justify-between rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => setOpenCourse(!openCourse)}
          >
            <span>{selectedCourse}</span>
            {openCourse ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
          {openCourse && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded shadow max-h-60 overflow-y-auto text-gray-700">
              {courses.map((course) => (
                <p
                  key={course}
                  onClick={() => {
                    setSelectedCourse(course);
                    setOpenCourse(false);
                  }}
                  className={`px-3 py-2 rounded cursor-pointer hover:bg-purple-100 ${
                    selectedCourse === course ? "bg-purple-200 font-semibold" : ""
                  }`}
                >
                  {course}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Year Dropdown */}
        <div className="relative flex-1 min-w-[150px]">
          <div
            className="py-2 px-3 bg-[#fafaff] text-gray-500 flex items-center justify-between rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => setOpenYear(!openYear)}
          >
            <span>{selectedYear}</span>
            {openYear ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
          {openYear && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded shadow max-h-60 overflow-y-auto text-gray-700">
              {years.map((year) => (
                <p
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setOpenYear(false);
                  }}
                  className={`px-3 py-2 rounded cursor-pointer hover:bg-purple-100 ${
                    selectedYear === year ? "bg-purple-200 font-semibold" : ""
                  }`}
                >
                  {year}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Time Dropdown */}
        <div className="relative flex-1 min-w-[150px]">
          <div
            className="py-2 px-3 bg-[#fafaff] text-gray-500 flex items-center justify-between rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => setOpenTime(!openTime)}
          >
            <span>{selectedTime}</span>
            {openTime ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
          {openTime && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded shadow max-h-60 overflow-y-auto text-gray-700">
              {times.map((time) => (
                <p
                  key={time}
                  onClick={() => {
                    setSelectedTime(time);
                    setOpenTime(false);
                  }}
                  className={`px-3 py-2 rounded cursor-pointer hover:bg-purple-100 ${
                    selectedTime === time ? "bg-purple-200 font-semibold" : ""
                  }`}
                >
                  {time}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
