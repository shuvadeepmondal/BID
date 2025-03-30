import { Link } from "react-router-dom";
import React from "react";
import AutoSVGSlider from "./AutoSVGSlider";
const Home: React.FC = () => {
  return (
    <>
    <div className="absolute circlePosition w-screen sm:w-[590px] h-[400px] bg-gradient-to-r from-indigo-400 rounded-[100%] top-[50%] left-[50%]  blur-[90px] translate-x-[-50%] translate-y-[-50%] z-[-1]" />
      <div className="max-w-6xl mx-auto h-[80vh] flex flex-col justify-center items-center">
      <AutoSVGSlider/>
        <h1 className="text-2xl p-5 ml-10 lg:p-0 lg:ml-0 lg:text-5xl bg-gradient-to-r from-indigo-900 to-indigo-800 bg-clip-text text-transparent font-bold tracking-widest">
          THE PLACE FOR BUY...INTERACT....DEAL
        </h1>
        <p className="text-gray-700 text-sm lg:text-lg mt-5">
          Shop and trade your products with your buddies
        </p>
        <Link to="/market">
          <button
            className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            type="button"
          >
            Explore
          </button>
        </Link>
      </div>
    </>
  );
};

export default Home;

