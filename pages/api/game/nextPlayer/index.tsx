import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../../utils/dbInteraction";

type Data = {
  status: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let gameID: string = req.body.gameID;

  //retrieve the players participating in the game
  const gameQuery = `SELECT * FROM game WHERE code = $1;`;
  let game = await runQuery(gameQuery, [gameID]);
  let nextPlayer = getNextPlayer(
    game.rows[0].activeplayer,
    game.rows[0].players
  );

  const updateGame = `UPDATE game SET activeplayer = $1 WHERE code = $2;`;
  await runQuery(updateGame, [nextPlayer, gameID]);

  //respond with game code
  res.status(200).json({ status: "done" });
}

const getNextPlayer = (activePlayer: string, allPlayers: string[]) => {
  let currentIndex = allPlayers.indexOf(activePlayer);
  let len = allPlayers.length;

  if (currentIndex + 1 < len) {
    return allPlayers[currentIndex + 1];
  } else {
    return allPlayers[0];
  }
};
