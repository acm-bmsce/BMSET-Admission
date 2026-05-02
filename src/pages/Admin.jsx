import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function Admin() {
  const [institutesData, setInstitutesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  
  // Password State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  const ADMIN_PASSWORD = "bmsetadmission"; // CHANGE THIS TO YOUR DESIRED PASSWORD

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const fetchInstitutes = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "institutes"));
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInstitutesData(docs);
    } catch (error) {
      console.error("Error fetching institutes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInstitutes();
    }
  }, [isAuthenticated]);

  const handleToggle = async (instId, category, courseId, currentStatus) => {
    setUpdating(`${instId}-${courseId}`);
    const instRef = doc(db, "institutes", instId);

    try {
      const fieldPath = `Programs Offered.${category}.${courseId}.reg_open`;
      await updateDoc(instRef, {
        [fieldPath]: !currentStatus
      });
      
      setInstitutesData(prev => prev.map(inst => {
        if (inst.id === instId) {
          const updatedInst = { ...inst };
          updatedInst["Programs Offered"][category][courseId].reg_open = !currentStatus;
          return updatedInst;
        }
        return inst;
      }));
    } catch (error) {
      alert("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  // --- LOGIN UI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
          <h2 className="text-2xl font-bold text-theme-primary mb-2 text-center">Admin Access</h2>
          <p className="text-theme-muted text-center mb-6 text-sm">Please enter the administrative password to continue.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 outline-none transition-all"
            />
            {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-theme-accent hover:bg-theme-hover text-white font-bold py-3 rounded-lg transition-all shadow-md active:scale-[0.98]"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN ADMIN UI ---
  if (loading) return <div className="text-center py-20 font-bold">Loading Data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme-primary">Admin Dashboard</h1>
          <p className="text-theme-muted">Manage real-time admission status for all institutes.</p>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors self-start"
        >
          Logout
        </button>
      </div>

      <div className="space-y-12">
        {institutesData.map((inst) => (
          <div key={inst.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-theme-primary">{inst.Institute}</h2>
              <p className="text-sm text-theme-muted">{inst["Full form"]}</p>
            </div>

            <div className="p-6">
              {Object.entries(inst["Programs Offered"] || {}).map(([category, courses]) => (
                <div key={category} className="mb-8 last:mb-0">
                  <h3 className="text-md font-semibold uppercase tracking-wider text-theme-accent mb-4">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(courses).map(([courseId, course]) => (
                      <div 
                        key={courseId} 
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/30"
                      >
                        <div className="pr-4">
                          <p className="font-bold text-theme-primary leading-tight">{course.name}</p>
                          <p className="text-xs text-theme-muted mt-1">Intake: {course.intake || 'N/A'}</p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${course.reg_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {course.reg_open ? 'Open' : 'Closed'}
                          </span>
                          
                          <button
                            onClick={() => handleToggle(inst.id, category, courseId, course.reg_open)}
                            disabled={updating === `${inst.id}-${courseId}`}
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                              ${course.reg_open ? 'bg-theme-accent' : 'bg-gray-300'}
                              ${updating === `${inst.id}-${courseId}` ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                          >
                            <span
                              className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition duration-200
                                ${course.reg_open ? 'translate-x-6' : 'translate-x-1'}
                              `}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}   