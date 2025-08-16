import React from 'react'
import HomeCard from '../components/HomeCard.jsx'
import Navbar from '../components/Navbar.jsx'

import { UsersRound , BookOpen , GraduationCap } from "lucide-react";

export default function HomePage() {
  const propArray = [{
    icon:UsersRound,
    title: "Find Study Partners",
    text: "Browse students taking similar courses and connect based on your schedule"
  },
  {
    icon:BookOpen,
    title: "Course Based Matching",
    text: "Filter by specific courses to find the most relevant study companions"
  },
  {
    icon:GraduationCap,
    title: "Academic Success",
    text: "Collaborate with peers to improve understanding and achieve better grades"
  }];  

  return (
    <div>
      <Navbar />
      <div className="flex flex-col space-y-8 border text-center bg-[#F0F0FA]">
        <div className="w-24 h-24 rounded-full bg-[#8976E9] flex items-center justify-center mx-auto mt-20 mb-0">
          <GraduationCap className="w-16 h-16 text-white"/>
        </div>

        <h1 className="text-4xl md:text-7xl font-semibold text-black mt-8">
          Find Your Perfect <br/> <span className="text-[#8C77E8] font-bold"> Study Buddy </span>
        </h1>

        <p className="text-base md:text-1xl text-[#7C7E9E] max-w-2xl mx-auto">
          Connect with fellow students in your courses. Study together, share knowledge, and achieve academic success as a team.
        </p>

        <div className="flex flex-col md:flex-row md:justify-center md:gap-7 mx-auto gap-5">
          <button className="flex items-center justify-center bg-[#8786F4] rounded-md w-60 px-4 py-2 gap-2">
            <UsersRound className="w-6 h-6 text-white" /> 
            <span className="text-white text-sm font-medium">Browse Study Buddies</span>
          </button>

          <button className="flex items-center justify-center bg-[#FAFAFF] rounded-md w-60 px-6 py-2 border-2 border-[#DFDEEC] gap-2"> 
            <BookOpen className="w-6 h-6 text-black" />
            <span className="text-black text-sm font-medium">Create Profile</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:py-10">
          {propArray.map((item, index) => 
            <HomeCard 
              key={index}
              icon={item.icon}
              title={item.title}
              text={item.text}
            />
          )}
        </div>
      </div>
    </div>
  )
}
