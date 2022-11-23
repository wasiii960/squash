import React from "react";
import { classNames } from "../utils/classNames";

function TextInput({
  label,
  Value,
  name,
  required,
  placeholder,
  className,
  onChange,
}) {
  return (
    <div className="items-center w-full gap-x-3">
      <label className="text-sm font-semibold text-primary">{label}</label>
      <textarea
        value={Value}
        onChange={(e) => onChange(e)}
        name={name}
        maxLength="999"
        required={required}
        placeholder={placeholder}
        className={classNames(
          "w-full px-4 py-2 bg-zinc-100 focus:border-2 focus:outline-none border-primary rounded-2xl mt-1",
          className
        )}
      />
    </div>
  );
}

export default TextInput;
