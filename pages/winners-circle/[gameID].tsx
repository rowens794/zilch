import React, { ReactElement } from "react";
import numeral from "numeral";
import Link from "next/link";
import { Player } from "../../utils/interfaces";

interface Props {
  winner: Player;
}

export default function Index({ winner }: Props): ReactElement {
  return (
    <div className="relative flex justify-center w-full h-full bg-red-700">
      <div className="w-full mt-12 text-center">
        <p className="w-full m-auto mb-24 font-extrabold text-center text-white text-7xl text-shadow-lg">
          ZILCH!
        </p>

        <p className="my-8 text-3xl text-white text-shadow-md">
          {winner.name} Won!
        </p>
        <p className="my-8 text-lg font-light text-white text-shadow-md">
          with a score of {numeral(winner.banked_score).format("#,#")}
        </p>

        <Link href="/">
          <a className="w-full text-white underline mt-36 drop-shadow-harshDkRed">
            Play Again?
          </a>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  let { gameID } = context.params;
  const protocol = context.req.headers["x-forwarded-proto"] || "http";
  const baseUrl = context ? `${protocol}://${context.req.headers.host}` : "";

  const res = await fetch(`${baseUrl}/api/getWinner`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameID }),
  });

  const json = await res.json();
  let { winner } = json;

  return {
    props: {
      winner,
    },
  };
}
