import React from "react";
import "../assets/css/spinner.css";

export default function Spinner() {
  return (
    <div className=" h-screen flex justify-center items-center bg-gray-500">
      <div className=" w-screen overflow-x-hidden overflow-y-hidden">
        <div className="bar">
          <div className="circle"></div>
          <p>Loading</p>
        </div>
      </div>
    </div>
  );
}
