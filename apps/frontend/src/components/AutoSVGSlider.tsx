import React, { useEffect, useState } from "react";
import svg1 from "../assets/Buy.svg";
import svg2 from "../assets/Interact.svg";
import svg3 from "../assets/Deal.svg";

const svgs = [svg1, svg2, svg3];

const AutoSVGSlider: React.FC = () => {
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % svgs.length);
      }, 3000);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="flex justify-center items-center h-96 w-full p-6 rounded-xl">
        <img
          src={svgs[index]}
          alt="SVG Slide"
          className="w-64 h-64 transition-opacity duration-500 ease-in-out opacity-100"
        />
      </div>
    );
  };

export default AutoSVGSlider;