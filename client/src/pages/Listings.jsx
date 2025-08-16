import React, { useState, useEffect } from 'react';

// BuddyList component to display the list of study buddies
const BuddyList = ({ buddies = [] }) => {
  return (
    <div className="mt-8">
      {buddies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buddies.map((buddy) => (
            <div key={buddy._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col">
              {/* Profile Header */}
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

              {/* Bio Section */}
              <p className="text-gray-600 mb-4">{buddy.bio}</p>
              
              {/* Courses Section */}
              <p className="font-semibold text-sm text-gray-800 mb-2">CURRENT COURSES</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {buddy.courses.map(course => (
                  <span key={course} className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">{course}</span>
                ))}
              </div>


              <div className="text-sm text-gray-600 space-y-1 mb-4">
    
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
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('All years');
  const [locationFilter, setLocationFilter] = useState('Any location');
  
  const [filteredBuddies, setFilteredBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const DUMMY_BUDDIES = [
    { _id: 'b1', fullname: 'Emma Chen', major: 'Computer Science', courses: ['Data Structures', 'Computer Science 101', 'Linear Algebra'], year: 'Junior', location: 'Library', bio: 'Passionate about algorithms and coding. Always happy to help explain complex concepts and learn from others.' },
    { _id: 'b2', fullname: 'Jane Smith', major: 'Biology', courses: ['BIO 301', 'CHEM 101'], year: 'Junior', location: 'Online', bio: 'I love all things biology, especially genetics. I am available for study sessions.' },
    { _id: 'b3', fullname: 'Peter Jones', major: 'Mathematics', courses: ['MATH 101'], year: 'Freshman', location: 'Coffee Shop', bio: 'Looking for a study buddy for calculus. I am a hard worker and love coffee.' },
    { _id: 'b4', fullname: 'Sarah Lee', major: 'Computer Science', courses: ['CS 101', 'CS 303'], year: 'Senior', location: 'Library', bio: 'I am a senior in computer science and would love to help or get help with complex problems.' },
  ];

  const years = ['All years', 'Freshman', 'Sophomore', 'Junior', 'Senior'];
  const studyLocations = ["Any location", "Coffee Shop", "Library", "Study Room", "Online"];

  useEffect(() => {
    // Simulate API call and set a small timeout to show a loading state
    setLoading(true);
    setTimeout(() => {
      const newFilteredBuddies = DUMMY_BUDDIES.filter(buddy => {
        const matchesSearch = buddy.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            buddy.major.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCourse = courseFilter === '' || buddy.courses.some(course => course.toLowerCase().includes(courseFilter.toLowerCase()));
        const matchesYear = yearFilter === 'All years' || buddy.year === yearFilter;
        const matchesLocation = locationFilter === 'Any location' || buddy.location === locationFilter;
        return matchesSearch && matchesCourse && matchesYear && matchesLocation;
      });
      setFilteredBuddies(newFilteredBuddies);
      setLoading(false);
    }, 500);

  }, [searchQuery, courseFilter, yearFilter, locationFilter]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Browse Study Buddies</h1>
            <p className="text-xl text-gray-600">Find the perfect study partner for your courses</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-full shadow-sm hover:bg-gray-50 transition-colors duration-200 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM4 10h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1v-10z"></path>
              </svg>
              Hide Filters
            </button>
            <button className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Profile
            </button>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Find Your Study Buddy</h2>
          
          {/* Search bar */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or major..."
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>

          {/* Filters dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="relative">
              <input
                value={courseFilter}
                placeholder="Search by course"
                onChange={(e) => setCourseFilter(e.target.value)}
                className="block w-full py-2 px-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            {/* Years Dropdown */}
            <div className="relative">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
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
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
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
        </div>

        {/* Conditional rendering based on state */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">Loading study buddies...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          <BuddyList buddies={filteredBuddies} />
        )}
        
      </div>
    </div>
  );
}