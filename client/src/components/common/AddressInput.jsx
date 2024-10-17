import React from "react";

export default function AddressInput({ title, address, onChange, error }) {
  const showError = error?.set && !address.trim();

  return (
    <div className="relative">
      <textarea
        onChange={onChange}
        className={`decoration:none px-6 py-2 border ${
          showError ? "" : "border-neutral-300"
        } focus-visible:outline-0 focus-visible:border-indigo-600 min-w-[200px] w-full md:w-fit max-w-[403px] rounded-xl h-[100px] font-cabin text-sm text-neutral-700`}
      >
        {address}
      </textarea>
      <div className="absolute text-xs left-10 -top-1.5 bg-white text-neutral-500 font-cabin px-2">
        {title}
      </div>
      {showError && (
        <div className="absolute top-[100px] w-full text-xs text-red-500 font-cabin">
          {error.message}
        </div>
      )}
    </div>
  );
}


