// src/Loader.js
import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center mt-8">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-[#fcd5d9] rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;
