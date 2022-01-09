import React, { ReactElement } from "react";
import PrimaryNavButton from "../components/buttons/primary-nav";
import { runQuery, setupTables } from "../utils/dbInteraction";

interface Props {}

export default function Index({}: Props): ReactElement {
  return (
    <div className="bg-red-700 w-full h-screen relative flex justify-center">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-white m-auto w-full text-center my-24 text-shadow-lg">
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
