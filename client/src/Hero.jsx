import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Webapp from './Pages/Webapp';
import Dashboard from './Dashboard';

const Hero = () => {
  return (
    <Router>
         <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/webapp" element={<Webapp />} /> 
        </Routes>
      <div className="bg-cover bg-center h-screen" style={{ backgroundImage: `url('https://c1.wallpaperflare.com/preview/270/660/995/technology-computer-music-technology.jpg')` }}>
        <div className="flex flex-col items-center justify-center h-screen bg-black bg-opacity-50">
          <div className="bg-white bg-opacity-50 p-8 rounded-lg max-w-md text-center">
           
              <h1 className="text-5xl font-bold mb-10 text-green-500">--Symphony--</h1>
            <p className="text-lg mb-8">
              Symphony is a Song Recommendation System built with machine learning and Spotify API that also has an EDA Dashboard. It is a data-driven application
              that provides personalized music recommendations based on user preferences.
              The EDA Dashboard offers interactive visualizations to explore music preferences.
            </p>
            <div className="flex justify-center gap-4">
            <Link to="/webapp" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                Get Recommendations
              </Link>
              <Link to="/dashboard" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                View Genre Analytics Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default Hero;
