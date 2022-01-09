import React, { ReactElement } from "react";

interface Props {
  label: string;
  placeholder: string;
  value: string;
  action: Function;
  id: string;
}

export default function Index({
  label,
  placeholder,
  value,
  action,
  id,
}: Props): ReactElement {
  return (
    <div>
      <p className="font-bold text-xl text-white text-left text-shadow">
        {label}
      </p>
      <div className="bg-white p-2 tranform -rotate-2 drop-shadow-harshDkRed my-2">
        <input
          type="text"
          id={id}
          className="block w-full text-center border-b border-gray-400 p-0 text-red-900 placeholder-gray-400 text-xl focus:outline-none sm:text-lg bg-white "
          placeholder={placeholder}
          onChange={(e) => action(e)}
          value={value}
        />
      </div>
    </div>
  );
}
