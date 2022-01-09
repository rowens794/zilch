import React, { ReactElement } from "react";

interface Props {
  text: string;
}

export default function index({ text }: Props): ReactElement {
  return (
    <div className="w-full px-4">
      <div className=" w-3 drop-shadow-harshDkRed text-2xl font-extrabold p-2 text-white text-center transform -rotate-2">
        <p>{text}</p>
      </div>
    </div>
  );
}
