import React, { ReactElement } from "react";

interface Props {
  showMessage: boolean;
}

export default function Index({ showMessage }: Props): ReactElement {
  return (
    <>
      {showMessage ? (
        <div className="z-30 w-full absolute top-60 animate-bounce">
          <div className="font-black text-4xl w-80 m-auto bg-yellow-300  rounded-full text-center text-red-600 py-8 drop-shadow-harshDkRed transform -rotate-6">
            <p className="font-black text-4xl text-center text-red-600 text-shadow-md-yellow">
              You
            </p>
            <p className="font-black text-6xl text-center text-red-600 text-shadow-md-yellow">
              Zilched
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
