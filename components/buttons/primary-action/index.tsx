import React, { ReactElement } from "react";

interface Props {
  action: Function;
  label: string;
}

export default function Index({ action, label }: Props): ReactElement {
  return (
    <button
      className="w-48 p-4 my-2 text-xl font-extrabold text-red-800 bg-white  drop-shadow-harshDkRed tranform -rotate-2"
      onClick={(e) => action(e)}
    >
      {label}
    </button>
  );
}
