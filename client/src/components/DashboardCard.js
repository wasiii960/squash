import React from "react";

const DashboardCard = ({ head, desc, val, children }) => {
  return (
    <div className=" flex flex-row w-1/2 justify-between items-center mt-3 bg-white px-5 py-3 rounded-md">
      <div className="flex flex-row items-center">
        {children}
        <div className="flex flex-col justify-between">
          <h1 className="text-xl font-semibold">{head}</h1>
          <h3 className="text-xs text-gray-500 font-normal">{desc}</h3>
        </div>
      </div>
      <h1 className="text-xl font-semibold">{val}</h1>
    </div>
  );
};

export default DashboardCard;
