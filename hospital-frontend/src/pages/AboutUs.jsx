
import React, { useState, useEffect } from "react";

const images = ["/4.png", "/5.png", "/6.png"];

const AboutUs = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-lg py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 opacity-5"></div>
        <div className={`text-center relative z-10 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">
            About Utkarsha Nursing Home
          </h1>
          <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto px-4">
            Your trusted healthcare partner since 2010, providing exceptional medical care with compassion and excellence
          </p>
          <div className="flex items-center justify-center gap-6 text-gray-600 flex-wrap">
            <span className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
              </svg>
              <span className="text-blue-700 font-medium">Established 2010</span>
            </span>
            <span className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">Serving 24/7</span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero Image Slideshow */}
      <div className="max-w-4xl mx-auto my-8 px-4">
        <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden shadow-lg group">
          {images.map((img, index) => (
            <img
              key={img}
              src={img}
              alt={`Hospital facility ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform ${
                index === currentImageIndex 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            />
          ))}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          
          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-6xl mx-auto my-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Utkarsha Nursing Home?</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group hover:bg-gradient-to-br hover:from-blue-50 hover:to-white">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Established 2010</h3>
            <p className="text-gray-600 group-hover:text-blue-700 transition-colors duration-300">Over 14 years of trusted healthcare excellence, serving thousands of patients with dedication and care.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group hover:bg-gradient-to-br hover:from-green-50 hover:to-white">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Premium Facilities</h3>
            <p className="text-gray-600 group-hover:text-green-700 transition-colors duration-300">State-of-the-art medical equipment, comfortable patient rooms, and modern healthcare infrastructure.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group hover:bg-gradient-to-br hover:from-purple-50 hover:to-white">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Expert Medical Team</h3>
            <p className="text-gray-600 group-hover:text-purple-700 transition-colors duration-300">Highly qualified doctors, experienced nurses, and caring support staff committed to your health.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group hover:bg-gradient-to-br hover:from-red-50 hover:to-white">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">24/7 Emergency Care</h3>
            <p className="text-gray-600 group-hover:text-red-700 transition-colors duration-300">Round-the-clock medical assistance and emergency services for your peace of mind.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group hover:bg-gradient-to-br hover:from-pink-50 hover:to-white">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Compassionate Care</h3>
            <p className="text-gray-600 group-hover:text-pink-700 transition-colors duration-300">Patient-centered approach with personalized treatment plans and genuine care for every individual.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group hover:bg-gradient-to-br hover:from-yellow-50 hover:to-white">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Affordable Healthcare</h3>
            <p className="text-gray-600 group-hover:text-yellow-700 transition-colors duration-300">Quality medical services at reasonable prices, making healthcare accessible to all sections of society.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;