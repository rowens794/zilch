import React, { ReactElement } from "react";

interface Props {
  msg: string;
}

export default function Index({ msg }: Props): ReactElement {
  return (
    <div className="my-4 w-56 m-auto">
      <p className="font-light text-xl text-white text-center text-shadow">
        {msg}
      </p>
    </div>
  );
}
