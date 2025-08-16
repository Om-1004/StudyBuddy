import React from "react";
import { Funnel, Plus } from "lucide-react";
import SearchBar from "../components/SearchBar";
import StudyUserCard from "../components/StudyUserCard";

export default function BrowsePage() {
  return (
    <div className="bg-[rgb(246,246,256)] pt-5 min-h-screen px-4 md:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="text-center md:text-left md:flex-1">
          <p className="md:pt-8 md:text-4xl font-extrabold text-3xl my-5">
            Browse Study Buddies
          </p>
          <p className="text-lg my-5 text-gray-500">
            Find the perfect study partner for your courses
          </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-2 mb-4 md:mb-0">
          <button className="flex items-center gap-2 bg-white hover:bg-gray-300 text-black px-4 py-2 rounded-md border border-black transition-colors">
            <Funnel size={20} />
            <span>Hide Filters</span>
          </button>
          <button className="flex items-center gap-2 bg-[#8786ed] hover:bg-[#7675d9] text-white px-4 py-2 rounded-md transition-colors">
            <Plus size={20} />
            <span>Create Profile</span>
          </button>
        </div>
      </div>

      <div className="pt-8 bg-[rgb(250,250,255)] ">
        <SearchBar />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-between gap-2 mt-6">
        <p className="font-bold text-lg">Available Study Partners</p>
        <p className="text-gray-500 justify-center text-sm">8 students found</p>
      </div>
      <StudyUserCard
        name={"Emma Rite"}
        major={"Computer Science"}
        year={"Sophomore"}
        bio={
          "Passionate about algorithms and coding. Always happy to help explain complex concepts and learn from others."
        }
        courses={["DSA", "Linear Algebra"]}
        times={["Morning","Afternoon"]}
        location={"library"}
      />
    </div>
  );
}
