import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInstitutes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "institutes"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInstitutes(data);
      } catch (error) {
        console.error("Error fetching institutes:", error);
      } finally {
        setLoading(false);
      }
    };
    getInstitutes();
  }, []);

  if (loading) return <div className="text-center py-20 font-bold text-theme-primary">Loading Institutes...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-theme-primary mb-4">Institutes</h2>
        <p className="text-theme-muted max-w-2xl mx-auto">
          Please select an institute below to explore the courses offered.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {institutes.map((inst) => {
          const shortForm = inst.Institute; // e.g., "BMSCE"
          const instituteId = shortForm.toLowerCase();
          const logoPath = `/${shortForm}LOGO.webp`;

          return (
            <Link 
              key={inst.id}
              to={`/institute/${instituteId}`}
              className="bg-theme-card rounded-xl p-6 shadow-sm group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 mb-6 flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={logoPath} 
                  alt={`${shortForm} Logo`}
                  className="w-full h-full object-contain bg-white border-8 border-white rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none'; 
                    e.target.nextSibling.style.display = 'flex'; 
                  }}
                />
                <div className="hidden w-16 h-16 bg-theme-accent/10 text-theme-accent rounded-full items-center justify-center">
                   <span className="font-bold text-sm">{shortForm}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-theme-primary mb-2">{inst.Institute}</h3>
              <p className="text-sm text-theme-muted grow">{inst["Full form"]}</p>
              
              <div className="mt-6 text-theme-accent font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Explore Programs <span>&rarr;</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}