import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function InstituteDetail() {
  const { id } = useParams(); // e.g., "bmsce"
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgImageExists, setBgImageExists] = useState(true);

  useEffect(() => {
    const fetchInstitute = async () => {
      setLoading(true);
      try {
        // We convert id to uppercase because our Firestore Doc IDs are uppercase (BMSCE)
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

  // Convert id to lowercase just in case the URL parameter is capitalized
  const lowerCaseId = id?.toLowerCase();

  const brochureLinks = {
    bmsce: "/brochures/bmsce.pdf",
  };

const videoLinks = {
  bmsce: "https://drive.google.com/file/d/BMSCE_FILE_ID/preview",
  bmsit: "https://drive.google.com/file/d/BMSIT_FILE_ID/preview",
};

  const brochure = brochureLinks[lowerCaseId];
  const video = videoLinks[lowerCaseId];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in flex flex-col min-h-[70vh]">
      <Link to="/" className="inline-flex items-center gap-2 text-theme-muted hover:text-theme-accent font-semibold text-sm mb-6 self-start">
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
          <p className="text-theme-accent font-semibold relative z-10">{institute["Institute"]}</p>
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
                    <div key={idx} className="bg-theme-card border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full rounded-xl hover:bg-theme-accent hover:border-theme-accent hover:-translate-y-1">
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

      <div className="mt-8 mb-4 flex flex-wrap gap-4 justify-center">

        {institute["Link"] && (
          <a
            href={institute["Link"]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-theme-accent hover:bg-theme-hover text-white px-8 py-3.5 rounded font-bold transition-all shadow-md"
          >
            Visit Official Institute Website
          </a>
        )}

        {/* --- NEW LOCAL BROCHURE BUTTON --- */}
        {brochure && (
          <a
            href={brochure}
            target="_blank"
            rel="noopener noreferrer"
            download // Optional: Remove if you want it to open in a tab instead of directly downloading
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-theme-hover text-white px-8 py-3.5 rounded font-bold transition-all shadow-md"
          >
            View Local Brochure
          </a>
        )}

        {institute["BrochurePDF"] && (
          <a
            href={institute["BrochurePDF"]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-theme-primary hover:bg-theme-hover text-white px-8 py-3.5 rounded font-bold transition-all shadow-md"
          >
            View Brochure PDF
          </a>
        )}

        

      </div>
      {video && (
  <div className="mt-10">
    <h3 className="text-2xl font-bold text-theme-primary mb-4 text-center">
      Campus Tour Video
    </h3>

    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <iframe
        src={video}
        width="100%"
        height="500"
        allow="autoplay"
        allowFullScreen
        className="w-full"
      ></iframe>
    </div>
  </div>
)}
    </div>
  );
}