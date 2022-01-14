import React, { ReactElement } from "react";
import PrimaryNavButton from "../components/buttons/primary-nav";
import { runQuery, setupTables } from "../utils/dbInteraction";

interface Props {}

export default function Index({}: Props): ReactElement {
  return (
    <div className="relative flex justify-center w-full h-full bg-red-700">
      <div className="text-center">
        <p className="w-full m-auto my-24 font-extrabold text-center text-white text-7xl text-shadow-lg">
          ZILCH!
        </p>
        <PrimaryNavButton href="/create-game" text="Create Game" />
        <PrimaryNavButton href="/join-game" text="Join Game" />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  // await setupTables();

  return {
    props: {
      msg: "hit",
    },
  };
}
