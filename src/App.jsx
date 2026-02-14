import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import InstituteDetail from './pages/InstituteDetail';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        {/* Main Content Area where pages will be injected */}
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/institute/:id" element={<InstituteDetail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;