import React, { useState, useEffect } from "react";

const images = ["/1.jpg", "/2.png", "/3.webp"];

const Home = () => {
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
            Utkarsha Nursing Home
          </h1>
          <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto px-4">
            Providing compassionate healthcare with advanced medical facilities since years
          </p>
          <div className="flex items-center justify-center gap-6 text-gray-600 flex-wrap">
            <span className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-blue-700 font-medium">Nagpur, Maharashtra</span>
            </span>
            <span className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">Open 24 Hours</span>
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
              alt={`Facility ${index + 1}`}
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



      {/* Doctors Section */}
      <div className="max-w-4xl mx-auto my-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Our Doctors</h2>
        <div className="grid md:grid-cols-2 gap-8">
            {/* Doctor 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group hover:bg-gradient-to-br hover:from-blue-50 hover:to-white">
              <div className="relative mb-4">
                <img
                  src="/DrRajashree Pande.png"
                  alt="Dr. Rajashree Pande"
                  className="w-32 h-32 mx-auto rounded-full object-cover group-hover:shadow-lg transition-all duration-300"
                />
                <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-semibold">Dr. Rajashree Pande</h3>
              <p className="text-gray-600 group-hover:text-pink-600 transition-colors duration-300">Gynecologist</p>
            </div>

            {/* Doctor 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group hover:bg-gradient-to-br hover:from-green-50 hover:to-white">
              <div className="relative mb-4">
                <img
                  src="/DrTushar Pande.jpg"
                  alt="Dr. Tushar Pande"
                  className="w-32 h-32 mx-auto rounded-full object-cover group-hover:shadow-lg transition-all duration-300"
                />
                <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-semibold">Dr. Tushar Pande</h3>
              <p className="text-gray-600 group-hover:text-green-600 transition-colors duration-300">Surgeon</p>
            </div>
          </div>
        </div>



      {/* Contact Section */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <svg className="w-8 h-8 mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-3">Location</h3>
                <a 
                  href="https://maps.app.goo.gl/2uqSaZmP46XHGHut7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors leading-relaxed"
                >
                  Utkarsha Nursing Home<br />
                  Manish Nagar, Nagpur
                </a>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <svg className="w-8 h-8 mx-auto mb-4 text-green-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <h3 className="text-xl font-semibold mb-3">Phone</h3>
                <a 
                  href="tel:+911234567890" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-lg"
                >
                  +91 12345 67890
                </a>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <svg className="w-8 h-8 mx-auto mb-4 text-yellow-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-3">Hours</h3>
                <p className="text-gray-300">
                  24/7 Emergency<br />
                  Always Available
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400 mb-2">
              © 2024 Utkarsha Nursing Home. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Committed to providing quality healthcare services to our community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;