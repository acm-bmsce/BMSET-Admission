import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function InstituteDetail() {
  const { id } = useParams(); // e.g., "bmsce"
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgImageExists, setBgImageExists] = useState(true);
  
  // State to track which video in the array is currently playing
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    const fetchInstitute = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "institutes", id.toUpperCase());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInstitute(docSnap.data());
          localStorage.setItem('lastVisitedInstitute', id);
        }
      } catch (error) {
        console.error("Error fetching institute:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitute();
  }, [id]);

  if (loading) return <div className="text-center py-20 font-bold text-theme-primary">Loading Details...</div>;
  if (!institute) return <div className="text-center py-20 text-xl font-bold text-theme-primary">Institute not found.</div>;

  const programsOffered = institute["Programs Offered"] || {};
  const programCategories = Object.keys(programsOffered);
  const bgImagePath = `/${institute["Institute"]}BG.png`;

  const lowerCaseId = id?.toLowerCase();

  const brochureLinks = {
    bmsce: "/brochures/bmsce.pdf",
  };

  // --- UPDATED: Now uses arrays to support multiple videos per institute ---
  const videoLinks = {
    bmsce: [
      "https://drive.google.com/file/d/1pgR8GDsjrdfqBlc7cmyLJp8zUiIMGHVM/preview",
      "https://drive.google.com/file/d/1Q1pFk8IlxzKmJx8lGbUHaST3-C4OkE47/preview"
    ],
    bmsit: [
      "https://drive.google.com/file/d/1zuf2uvp6-ZHLiTl1Nv8TZ8N8hBgKnxEY/preview"
    ],
  };

  const brochure = brochureLinks[lowerCaseId];
  
  // Grab the array of videos, or fallback to the DB video if it exists
  const videos = videoLinks[lowerCaseId] || (institute["CampusVideo"] ? [institute["CampusVideo"]] : []);
  const currentVideo = videos[activeVideoIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in flex flex-col min-h-[70vh]">
      <Link to="/" className="inline-flex items-center gap-2 text-theme-muted hover:text-orange-600 font-semibold text-sm mb-6 self-start transition-colors">
        <span>&larr;</span> Back to Institutes
      </Link>

      <div className="bg-theme-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="bg-theme-primary p-8 text-theme-inverse relative overflow-hidden min-h-50 flex flex-col justify-center">
          {bgImageExists ? (
            <>
              <img 
                src={bgImagePath} 
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
                onError={() => setBgImageExists(false)}
              />
              <div className="absolute inset-0 bg-black/60 z-0"></div>
            </>
          ) : (
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 z-0"></div>
          )}
          <h2 className="text-3xl font-bold mb-2 relative z-10">{institute["Full form"]}</h2>
          <p className="text-orange-500 font-semibold relative z-10">{institute["Institute"]}</p>
        </div>
      </div>

      <div className="grow">
        {programCategories.length === 0 ? (
          <p className="text-theme-muted italic">Course details will be updated shortly.</p>
        ) : (
          programCategories.map((categoryName, index) => {
            const coursesObject = programsOffered[categoryName];
            const courseList = Object.values(coursesObject).sort((a, b) => a.name.localeCompare(b.name));

            return (
              <div key={index} className="mb-12">
                <h3 className="text-2xl font-bold text-theme-primary mb-6">{categoryName} Programs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courseList.map((course, idx) => (
                    <div key={idx} className="bg-theme-card border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full rounded-xl hover:bg-orange-600 hover:border-orange-600 hover:-translate-y-1">
                      <h4 className="text-lg font-bold text-theme-primary mb-3 pr-4 grow group-hover:text-white transition-colors">
                        {course.name}
                      </h4>
                      <div className="mt-auto flex flex-col gap-1 text-base text-black group-hover:text-white transition-colors">
                        <div className="flex justify-between border-t border-gray-100 group-hover:border-white/20 pt-2 mt-2">
                          <span className="font-medium">Intake:</span>
                          <span>{course.intake ? `${course.intake} Seats` : 'Not available'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Fees:</span>
                          <span className={course.fees ? "font-bold" : "italic"}>{course.fees || 'Not available'}</span>
                        </div>
                        {course.reg_open === false && (
                          <div className="mt-3 pt-3 border-t border-gray-100 group-hover:border-white/20">
                            <p className="font-bold text-sm text-center">
                              Admission Closed. <a href="https://forms.gle/D3DGbCKApYTqnkTw6" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Register here for waitlist</a>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- UPDATED MULTI-VIDEO PLAYER --- */}
      {videos.length > 0 && (
        <div className="mt-8 mb-12 flex flex-col items-center">
          <h3 className="text-xl font-bold text-theme-primary mb-4">Campus Video Preview</h3>
          <div className="w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden shadow-md">
            <iframe 
              src={currentVideo} 
              allow="autoplay" 
              allowFullScreen
              className="w-full h-full border-0"
              title={`Campus Video ${activeVideoIndex + 1}`}
            ></iframe>
          </div>
          
          {/* Video Switcher Buttons (only shows if there is more than 1 video) */}
          {videos.length > 1 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveVideoIndex(index)}
                  className={`px-6 py-2 rounded-full font-bold transition-all shadow-sm ${
                    activeVideoIndex === index
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Part {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 mb-4 flex flex-wrap gap-4 justify-center">
        {institute["Link"] && (
          <a
            href={institute["Link"]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded font-bold transition-all shadow-md"
          >
            Visit Official Institute Website
          </a>
        )}

        {brochure && (
          <a
            href={brochure}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded font-bold transition-all shadow-md"
          >
            View Local Brochure
          </a>
        )}

        {institute["BrochurePDF"] && (
          <a
            href={institute["BrochurePDF"]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-theme-primary hover:opacity-90 text-white px-8 py-3.5 rounded font-bold transition-all shadow-md"
          >
            View Brochure PDF
          </a>
        )}
      </div>
    </div>
  );
}