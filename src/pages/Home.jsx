import React from 'react';
import { Link } from 'react-router-dom';
import { institutes } from '../data/institutes';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-theme-primary mb-4">Institutes</h2>
        <p className="text-theme-muted max-w-2xl mx-auto">
        Please select an institute below to explore the courses offered.
        </p>
      </div>

      {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3-4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {institutes.map((institute, index) => {
          const shortForm = institute["Institute"];
          
          const instituteId = shortForm.toLowerCase();

          const logoPath = `/${shortForm}LOGO.png`;

          return (
            <Link 
              key={index}
              to={`/institute/${instituteId}`}
              className="bg-theme-card rounded-xl p-6 shadow-sm border border-gray-100 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 mb-6 flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={logoPath} 
                  alt={`${shortForm} Logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.style.display = 'none'; // Hides broken image
                    e.target.nextSibling.style.display = 'flex'; // Shows fallback icon
                  }}
                />
                
                <div className="hidden w-16 h-16 bg-theme-accent/10 text-theme-accent rounded-full items-center justify-center">
                   <span className="font-bold text-sm">{shortForm}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-theme-primary mb-2">{institute["Institute"]}</h3>
              <p className="text-sm text-theme-muted grow">{institute["Full form"]}</p>
              
              <div className="mt-6 text-theme-accent font-semibold text-sm flex items-center gap-1 group-hover:gap-2 group-hover:text-theme-hover transition-all">
                Explore Programs <span>&rarr;</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}