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
          className=" bg-yellow-300 p-2 text-yellow-800 text-lg my-2 drop-shadow-harshDkRed tranform -rotate-2 font-extrabold w-36 mx-auto"
          onClick={(e) => action(e)}
        >
          {label}
        </button>
      ) : (
        <button className=" bg-gray-400 p-2 text-red-800 text-lg my-2 drop-shadow-harshDkRed tranform -rotate-2 font-extrabold w-36 mx-auto">
          {label}
        </button>
      )}
    </>
  );
}
