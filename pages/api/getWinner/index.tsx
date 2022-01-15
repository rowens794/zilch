import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../utils/dbInteraction";
import { Player } from "../../../utils/interfaces";

type Data = {
  winner: Player;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // generate a unique game ID and get host name
  let { gameID }: { gameID: string } = req.body;

  //get lobby screen status details
  let playerList = await getPlayers(gameID);
  let sortedPlayers = playerList.sort((a, b) => {
    return b.banked_score - a.banked_score;
  });

  //respond with game code
  res.status(200).json({ winner: sortedPlayers[0] });
}

const getPlayers = (gameID: string): Promise<Player[]> => {
  let promise = new Promise<Player[]>(async (resolve, reject) => {
    const playersQueryText = `SELECT * FROM player WHERE game = $1`;
    let playersQuery = await runQuery(playersQueryText, [gameID]);
    let players = playersQuery.rows;

    resolve(players);
  });

  return promise;
};
