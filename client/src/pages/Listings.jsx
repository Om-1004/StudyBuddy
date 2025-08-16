import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const BuddyList = ({ buddies = [] }) => {
  return (
    <div className="mt-8">
      {buddies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buddies.map((buddy) => (
            <div key={buddy._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{buddy.fullname}</h3>
                  <p className="text-sm text-gray-500">{buddy.major} • {buddy.year}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{buddy.bio}</p>
              
              <p className="font-semibold text-sm text-gray-800 mb-2">CURRENT COURSES</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {buddy.courses.map(course => (
                  <span key={course} className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">{course}</span>
                ))}
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{buddy.availability}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.899a2 2 0 01-2.828 0L6.343 16.657a6 6 0 118.485-8.485l.707.707.707-.707a6 6 0 018.485 8.485z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>Prefers {buddy.location}</span>
                </div>
              </div>

              <div className="text-center mt-auto">
                <button className="bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg w-full hover:bg-indigo-600 transition-colors duration-200">
                  Connect for Study Session
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          <p className="text-lg">No study buddies found with those filters.</p>
          <p className="text-sm">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default function Listings() {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    course: '',
    university: '',
    year: 'All years',
    location: 'Any location',
  });
  
  const [filteredBuddies, setFilteredBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canadianUniversities = [
    "Acadia University", "Algoma University", "Athabasca University", "Bishop's University", 
    "Brandon University", "Brock University", "Cape Breton University", "Carleton University", 
    "Canadian Mennonite University", "Concordia University", "Concordia University of Edmonton", 
    "Dalhousie University", "École de technologie supérieure (ETS)", "Emily Carr University of Art and Design", 
    "First Nations University of Canada", "HEC Montréal", "Kwantlen Polytechnic University", 
    "Lakehead University", "Laurentian University", "MacEwan University", "McGill University", 
    "McMaster University", "Memorial University of Newfoundland", "Mount Allison University", 
    "Mount Royal University", "Mount Saint Vincent University", "Nipissing University", 
    "OCAD University", "Polytechnique Montréal", "Queen's University", "Royal Roads University", 
    "Simon Fraser University", "St. Francis Xavier University", "St. Thomas University", 
    "Thompson Rivers University", "Toronto Metropolitan University (TMU)", "Trent University", 
    "Université de Montréal", "Université de Moncton", "Université de Sherbrooke", 
    "Université Laval", "Université Sainte-Anne", "University of Alberta", "University of British Columbia", 
    "University of Guelph", "University of Manitoba", "University of New Brunswick", 
    "University of Northern British Columbia", "University of Ottawa", "University of Prince Edward Island", 
    "University of Regina", "University of Saskatchewan", "University of Toronto", 
    "University of Victoria", "University of Waterloo", "University of Winnipeg", 
    "Western University", "Wilfrid Laurier University", "York University"
  ];
  const years = ['All years', 'Freshman', 'Sophomore', 'Junior', 'Senior'];
  const studyLocations = ["Any location", "Coffee Shop", "Library", "Study Room", "Online"];

  useEffect(() => {
    const fetchBuddies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const url = new URL('http://localhost:3000/api/listings/getListings');
        url.searchParams.append('searchTerm', sidebardata.searchTerm);
        url.searchParams.append('course', sidebardata.course);
        url.searchParams.append('university', sidebardata.university);
        url.searchParams.append('year', sidebardata.year === 'All years' ? '' : sidebardata.year);
        url.searchParams.append('location', sidebardata.location === 'Any location' ? '' : sidebardata.location);
        
        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setFilteredBuddies(data);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load study buddies. Please ensure your backend server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuddies();
  }, [sidebardata]); 
  
  const handleChange = (e) => {
    setSidebardata({ ...sidebardata, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Browse Study Buddies</h1>
            <p className="text-xl text-gray-600">Find the perfect study partner for your courses</p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Find Your Study Buddy</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="searchTerm"
                  value={sidebardata.searchTerm}
                  onChange={handleChange}
                  placeholder="Search by name or major..."
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <div className="relative">
                <input
                  type="text"
                  id="course"
                  value={sidebardata.course}
                  placeholder="Search by course"
                  onChange={handleChange}
                  className="block w-full py-2 px-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                />
              </div>

              <div className="relative">
                <select
                  id="university"
                  value={sidebardata.university}
                  onChange={handleChange}
                  className="block w-full py-2 px-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">All universities</option>
                  {canadianUniversities.map(university => (
                    <option key={university} value={university}>{university}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              <div className="relative">
                <select
                  id="year"
                  value={sidebardata.year}
                  onChange={handleChange}
                  className="block w-full py-2 px-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              <div className="relative">
                <select
                  id="location"
                  value={sidebardata.location}
                  onChange={handleChange}
                  className="block w-full py-2 px-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                >
                  {studyLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <button type="submit" className="mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 w-full">
              Search
            </button>
          </form>
        </div>

        <div className='flex-1'>
          <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
            Listing results:
          </h1>
          <div className='p-7 flex flex-wrap gap-4'>
            {loading ? (
              <p className='text-xl text-slate-700'>Loading study buddies...</p>
            ) : error ? (
              <p className='text-xl text-red-500'>{error}</p>
            ) : filteredBuddies.length === 0 ? (
              <p className='text-xl text-slate-700'>No study buddies found!</p>
            ) : (
              <BuddyList buddies={filteredBuddies} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}