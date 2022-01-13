import React, { ReactElement } from "react";

interface Props {
  displayPlayerName: boolean;
  playerName: string;
}

export default function Index({
  //game styling / stage management
  displayPlayerName,
  playerName,
}: Props): ReactElement {
  return (
    <>
      {displayPlayerName ? (
        <div>
          <div className="w-full px-4 my-4">
            <p className="w-full p-2 mx-auto my-2 text-lg font-extrabold text-center text-yellow-800 bg-yellow-200 drop-shadow-harshDkRed tranform -rotate-2">
              {playerName} IS ROLLING
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
