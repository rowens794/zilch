import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../utils/dbInteraction";

type Data = {
  gameStarted: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let gameID: string = req.body.gameID;

  //retrieve the players participating in the game
  const playerCodeList = {
    text: `SELECT code FROM "player" WHERE game = $1`,
    values: [gameID],
    rowMode: "array",
  };
  let playerCodes = await runQuery(playerCodeList);

  let parsedPlayerList: string[] = [];
  playerCodes.rows.forEach((player: string) => {
    parsedPlayerList.push(player[0]);
  });

  //set the active player
  let activePlayer = parsedPlayerList[0];

  const updateGame = `UPDATE game SET game_started = $1, players=$2, activePlayer=$3 WHERE code = $4;`;
  await runQuery(updateGame, [true, parsedPlayerList, activePlayer, gameID]);

  //respond with game code
  res.status(200).json({ gameStarted: true });
}
