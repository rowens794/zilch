import React, { ReactElement } from "react";

interface Props {
  lastTurnID: string | null;
}

export default function index({ lastTurnID }: Props): ReactElement {
  return (
    <div className="w-full">
      <div className="w-64 px-4 m-auto my-4 transform bg-red-400 -rotate-3">
        <p className="text-xl text-center text-white text-shadow-sm">
          {lastTurnID ? "This is the last turn!" : ""}
        </p>
      </div>
    </div>
  );
}
