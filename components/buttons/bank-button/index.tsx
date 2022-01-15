import React, { ReactElement } from "react";

interface Props {
  action: Function;
  label: string;
  active: boolean;
}

export default function Index({ action, label, active }: Props): ReactElement {
  return (
    <>
      {active ? (
        <button
          className="p-2 mx-auto my-2 text-sm font-extrabold text-green-800 bg-green-300 xs:text-lg drop-shadow-harshDkRed tranform -rotate-2 w-28 xs:w-36"
          onClick={(e) => action(e)}
        >
          {label}
        </button>
      ) : (
        <button className="p-2 mx-auto my-2 text-sm font-extrabold text-red-800 bg-gray-400 xs:text-lg drop-shadow-harshDkRed tranform -rotate-2 w-28 xs:w-36">
          {label}
        </button>
      )}
    </>
  );
}
