import { Dispatch, JSX, SetStateAction, useState } from "react";
import Auth from "./auth/Auth";

export default function Landingpage({
  setIsLogged,
}: {
  setIsLogged: Dispatch<SetStateAction<boolean | null>>;
}): JSX.Element {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      
      <header className="w-full bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-row items-center justify-between">
          
          <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
            Roomify 
          </h1>
          
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition duration-150"
            >
              Docs
            </a>
            
            <button 
              onClick={() => setIsLoginOpen(true)} 
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 text-white text-sm font-semibold rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login / Sign Up
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center py-16">
        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            Connect. Collaborate. <span className="text-indigo-600">Roomify.</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-3 mb-6">
            The simplest way to create dedicated rooms for your community, project, or friends. Real-time messaging, effortless organization.
          </p>
          
          <button 
            onClick={() => setIsLoginOpen(true)} 
            className="bg-green-500 hover:bg-green-600 px-8 py-2.5 text-white font-bold text-lg rounded-lg shadow-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Get Started Now
          </button>
          
          <div className="mt-10">
            {/*  */}
          </div>
        </div>
      </main>
      
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <Auth 
            onClose={() => setIsLoginOpen(false)} 
            setIsLogged={setIsLogged} 
          />
        </div>
      )}
    </div>
  );
}