import React, { ReactElement } from "react";

interface Props {
  action: Function;
  label: string;
}

export default function Index({ action, label }: Props): ReactElement {
  return (
    <button
      className=" bg-white p-4 text-red-800 text-xl my-2 drop-shadow-harshDkRed tranform -rotate-2 font-extrabold w-48"
      onClick={(e) => action(e)}
    >
      {label}
    </button>
  );
}
