import React from "react";

function Button({ primary, secondry, label, onClick }) {
  return (
    <button
      onClick={(e) => onClick(e)}
      className="bg-red-600 py-0.5 px-3 rounded text-white font-semibold text-xl border-2 border-red-600 hover:bg-zinc-100 hover:text-red-600 cursor-pointer duration-300"
    >
      {label}
    </button>
  );
}

export default Button;
