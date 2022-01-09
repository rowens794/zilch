import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../../utils/dbInteraction";

type Data = {
  gameStatus: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // generate a unique game ID and get host name
  let { gameID }: { gameID: string } = req.body;

  //get lobby screen status details
  let gameExistsAndIsOpen = await getGameStatus(gameID);

  //respond with game code
  res.status(200).json({ gameStatus: gameExistsAndIsOpen });
}

const getGameStatus = (gameID: string): Promise<boolean> => {
  let promise = new Promise<boolean>(async (resolve, reject) => {
    const gameQueryText = `SELECT game_started FROM game WHERE code = $1`;
    let gameStartedQuery = await runQuery(gameQueryText, [gameID]);

    let gameIsActive = false;
    if (gameStartedQuery.rows[0]) {
      gameIsActive = !gameStartedQuery.rows[0].game_started;
    }

    resolve(gameIsActive);
  });

  return promise;
};
