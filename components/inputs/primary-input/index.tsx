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
      <p className="text-xl font-bold text-left text-white text-shadow">
        {label}
      </p>
      <form
        className="p-2 my-2 bg-white tranform -rotate-2 drop-shadow-harshDkRed"
        autoComplete="off"
      >
        <input
          type="text"
          id={id}
          className="block w-full p-0 text-xl text-center text-red-900 placeholder-gray-400 bg-white focus:outline-none sm:text-lg "
          placeholder={placeholder}
          onChange={(e) => action(e)}
          value={value}
        />
      </form>
    </div>
  );
}
