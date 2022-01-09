import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../../utils/dbInteraction";

type Data = {
  roll: number[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let roll: number[] = [];

  for (let i = 0; i < 6; i++) {
    roll.push(randomIntFromInterval(1, 6));
  }

  //respond with game code
  res.status(200).json({ roll });
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
