import React, { ReactElement } from "react";
import numeral from "numeral";
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
      </div>
    </div>
  );
}

interface Props {}

export async function getServerSideProps(context: any) {
  let { gameID, userID } = context.params;
  const protocol = context.req.headers["x-forwarded-proto"] || "http";
  const baseUrl = context ? `${protocol}://${context.req.headers.host}` : "";

  const res = await fetch(`${baseUrl}/api/getWinner`, {
    method: "POST", // or 'PUT'
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

interface AbortProps {
  action: React.MouseEventHandler;
}

const AbortButton = ({ action }: AbortProps) => {
  return (
    <a onClick={action}>
      <svg
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        // xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="46.032px"
        height="46.033px"
        viewBox="0 0 46.032 46.033"
        className=" drop-shadow-harshDkRed"
        // xml:space="preserve"
      >
        <path
          fill="white"
          d="M8.532,18.531l8.955-8.999c-0.244-0.736-0.798-1.348-1.54-1.653c-1.01-0.418-2.177-0.185-2.95,0.591L1.047,20.479
			c-1.396,1.402-1.396,3.67,0,5.073l11.949,12.01c0.771,0.775,1.941,1.01,2.951,0.592c0.742-0.307,1.295-0.918,1.54-1.652l-8.956-9
			C6.07,25.027,6.071,21.003,8.532,18.531z"
        />
        <path
          fill="white"
          d="M45.973,31.64c-1.396-5.957-5.771-14.256-18.906-16.01v-5.252c0-1.095-0.664-2.082-1.676-2.5
			c-0.334-0.138-0.686-0.205-1.033-0.205c-0.705,0-1.398,0.276-1.917,0.796L10.49,20.479c-1.396,1.402-1.396,3.669-0.001,5.073
			l11.95,12.009c0.517,0.521,1.212,0.797,1.92,0.797c0.347,0,0.697-0.066,1.031-0.205c1.012-0.418,1.676-1.404,1.676-2.5V30.57
			c4.494,0.004,10.963,0.596,15.564,3.463c0.361,0.225,0.77,0.336,1.176,0.336c0.457,0,0.91-0.139,1.297-0.416
			C45.836,33.429,46.18,32.515,45.973,31.64z"
        />
      </svg>
    </a>
  );
};
