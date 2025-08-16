import React from 'react';

export default function HomeCard({ icon, title, text }) {
  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-60 md:w-[350px]">
      {icon}  
      <h2 className="mt-4 font-bold text-lg text-center">{title}</h2>
      <p className="mt-2 text-gray-500 text-sm text-center">{text}</p>
    </div>
  );
}
