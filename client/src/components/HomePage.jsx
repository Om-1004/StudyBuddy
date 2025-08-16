
import React from 'react'
import HomeCard from '../components/HomeCard.jsx'
import Navbar from '../components/Navbar.jsx'
import Listings from '../pages/Listings.jsx';
import { Link } from 'react-router-dom'
import { UsersRound , BookOpen , GraduationCap } from "lucide-react";


export default function HomePage() {
  const propArray = [
    {
      icon: (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
          <UsersRound className="w-6 h-6 text-[#6270E9]" />
        </div>
      ),
      title: "Find Study Partners",
      text: "Browse students taking similar courses and connect based on your schedule"
    },
    {
      icon: (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
          <BookOpen className="w-6 h-6 text-[#6270E9]" />
        </div>
      ),
      title: "Course Based Matching",
      text: "Filter by specific courses to find the most relevant study companions"
    },
    {
      icon: (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
          <GraduationCap className="w-6 h-6 text-[#6270E9]" />
        </div>
      ),
      title: "Academic Success",
      text: "Collaborate with peers to improve understanding and achieve better grades"
    }
  ];  

  return (
    <div>

      <div className="flex flex-col space-y-8 border text-center bg-[#F0F0FA] pb-20">
        
        <div className="w-24 h-24 rounded-full bg-[#8976E9] flex items-center justify-center mx-auto mt-20">
          <GraduationCap className="w-16 h-16 text-white"/>
        </div>

        <h1 className="text-black-100 text-5xl"> Find Your Perfect <p className="text-[#8C77E8] font-bold"> Study Buddy </p> </h1>
        <p className="text-[#7C7E9E] text-1xl"> Connect with fellow students in your courses. Study together, share 
          knowledge, and achieve academic success as a team </p>
        <Link to="/listings" className="flex justify-content items-center bg-[#8786F4] rounded-md w-60 px-4 py-2 mx-auto">
          <UsersRound className="w-10 h-5 text-white" />
          <p className="text-white text-sm"> Browse Study Buddies </p>
        </Link>
        <button className="flex justify-content items-center bg-[#FAFAFF] rounded-md w-55 px-8 py-2 mx-auto border-2 border-[#DFDEEC]"> 
          <BookOpen className="w-10 h-5 text-black" />
          <p className="text-black text-sm"> Create Profile </p>
        </button>
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          {propArray.map((item, index) => (
            <HomeCard 
              key={index}
              icon={item.icon}
              title={item.title}
              text={item.text}
            />
          ))}
        </div>
        < Listings />
      </div>
      
      
    </div>
  );
}

