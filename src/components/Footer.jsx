import React from 'react';
import { Link } from 'react-router-dom';
import { institutes } from '../data/institutes';

// I slightly lowered the frequency here (0.65 -> 0.60) to make the grain a bit 'coarser' and more visible
const NOISE_PATTERN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.60' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`;

export default function Footer() {
  return (
    <footer className="relative bg-theme-footer text-slate-300 py-12 mt-auto text-sm border-t border-white/10 overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-white/10 via-black/10 to-white/10" />
        
        {/* Grain Effect - Increased opacity-20 to opacity-40 */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ backgroundImage: NOISE_PATTERN }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Left Column */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-theme-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="leading-snug">1908, Bull Temple Road Bengaluru-560019</span>
          </div>

          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-theme-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <div className="flex flex-col space-y-1">
              <a href="mailto:info@bmsetadmission.org" className="hover:text-theme-accent transition-colors">
                info@bmsetadmission.org
              </a>
              <a href="mailto:director@bmsceadmission.org" className="hover:text-theme-accent transition-colors">
                director@bmsetadmission.org
              </a>
              <a href="mailto:contact@bmsceadmission.org" className="hover:text-theme-accent transition-colors">
                contact@bmsetadmission.org
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-theme-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <a href="tel:08026614358" className="hover:text-theme-accent transition-colors">
              080-26614358
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {institutes.map((inst, index) => {
              const instituteId = inst["Institute"].toLowerCase();
              return (
                <Link 
                  key={index}
                  to={`/institute/${instituteId}`} 
                  className="flex items-start gap-2 hover:text-theme-accent transition-colors group"
                >
                  <span className="text-slate-500 group-hover:text-theme-accent mt-0.5">•</span>
                  <span>{inst["Full form"]} ({inst["Institute"]})</span>
                </Link>
              );
            })}
          </div>
        </div>
        
      </div>
    </footer>
  );
}