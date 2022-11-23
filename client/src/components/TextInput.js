import React from "react";
import { classNames } from "../utils/classNames";

function TextInput({
  label,
  Value,
  name,
  type,
  required,
  placeholder,
  className,
  onChange,
  ...props
}) {
  return (
    <>
      <label className="text-sm font-semibold text-primary">{label}</label>
      <input
        {...props}
        value={Value}
        onChange={(e) => onChange(e)}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={classNames(
          "w-full px-8 py-2 bg-zinc-100 border-2 border-zinc-100 focus:outline-none focus:border-primary duration-200 rounded-2xl mt-1",
          className
        )}
      />
    </>
  );
}

export default TextInput;
