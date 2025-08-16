import React from "react";
import { User, Clock } from "lucide-react";

export default function StudyUserCard({
  name,
  major,
  year,
  bio,
  courses,
  times,
  location,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 my-4 w-full max-w-sm border hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        <div className="rounded-full p-3 border text-white bg-[#8786ed]">
          <User size={20} />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-gray-500 text-sm">
            {major} • {year}
          </p>
        </div>
      </div>
      <p className="text-sm my-4 text-gray-700">{bio}</p>
      {courses?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2 tracking-wide">
            CURRENT COURSES
          </p>
          <div className="flex flex-wrap gap-2">
            {courses.map((course, index) => (
              <span
                key={index}
                className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium"
              >
                {course}
              </span>
            ))}
          </div>
          <div className="flex flex-row gap-1 pt-3">
            <Clock size={15}  color="gray"/>
            <div className="flex flex-row text-xs text-gray-500">
              {times.map((time, index) => (
                <span key={index} className="">
                  {time}
                  {index < times.length - 1 && <span>,&nbsp;</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
