import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { institutes } from '../data/institutes';

export default function InstituteDetail() {
  const { id } = useParams();
  
  // 1. New State to track if the custom background image exists
  const [bgImageExists, setBgImageExists] = useState(true);
  
  const institute = institutes.find(inst => inst["Institute"].toLowerCase() === id);

  useEffect(() => {
    if (institute) {
      localStorage.setItem('lastVisitedInstitute', id);
      // 2. Reset the check whenever the institute changes (optimistically assume image exists)
      setBgImageExists(true);
    }
  }, [id, institute]);

  if (!institute) {
    return <div className="text-center py-20 text-xl font-bold text-theme-primary">Institute not found.</div>;
  }

  const programsOffered = institute["Programs Offered"] || {};
  const programCategories = Object.keys(programsOffered);
  
  // Construct the dynamic image path (e.g., "/BMSCEBG.png")
  const bgImagePath = `/${institute["Institute"]}BG.png`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in flex flex-col min-h-[70vh]">
      <Link 
        to="/"
        className="inline-flex items-center gap-2 text-theme-muted hover:text-theme-accent font-semibold text-sm transition-colors mb-6 self-start"
      >
        <span>&larr;</span> Back to Institutes
      </Link>

      {/* Institute Header */}
      <div className="bg-theme-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        
        {/* Main Header Container - We keep bg-theme-primary as a safe fallback color behind everything */}
        <div className="bg-theme-primary p-8 text-theme-inverse relative overflow-hidden min-h-50 flex flex-col justify-center">
          
          {/* LOGIC: Check for Custom Background Image */}
          {bgImageExists ? (
            <>
              {/* 1. The Custom Image */}
              <img 
                src={bgImagePath} 
                alt="Institute Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
                onError={() => setBgImageExists(false)} // If 404, switch to fallback mode
              />
              {/* 2. Dark Overlay - Essential for reading white text on top of photos */}
              <div className="absolute inset-0 bg-black/60 z-0"></div>
            </>
          ) : (
             /* FALLBACK: The original blob design (Only shows if bgImageExists is false) */
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 z-0"></div>
          )}

          {/* Text Content (z-10 ensures it sits ON TOP of the image/overlay) */}
          <h2 className="text-3xl font-bold mb-2 relative z-10">{institute["Full form"]}</h2>
          <p className="text-theme-accent font-semibold relative z-10">{institute["Institute"]}</p>
        </div>
      </div>

      {/* Dynamic Programs Rendering */}
      {programCategories.length === 0 ? (
        <p className="text-theme-muted italic grow">Course details will be updated shortly.</p>
      ) : (
        <div className="grow">
          {programCategories.map((categoryName, index) => {
            const coursesObject = programsOffered[categoryName];
            const courseList = Object.values(coursesObject).sort((a, b) => a.localeCompare(b));

            return (
              <div key={index} className="mb-12">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-theme-primary">{categoryName} Programs</h3>
                  <div className="h-1 grow bg-gray-200 ml-6 rounded-full overflow-hidden">
                      <div className="w-24 h-full bg-theme-accent"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courseList.map((courseName, idx) => (
                    <div key={idx} className="bg-theme-card border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col h-full">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-theme-accent translate-x-full group-hover:translate-x-0 transition-transform"></div>
                      <h4 className="text-lg font-bold text-theme-primary mb-4 pr-4 grow">{courseName}</h4>

                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View More External Link Button */}
      {institute["Link"] && (
        <div className="mt-8 mb-4 text-center">
          <a 
            href={institute["Link"]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-theme-accent hover:bg-theme-hover text-white px-8 py-3.5 rounded font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Visit Official Institute Website
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}