import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../utils/dbInteraction";

type Data = {
  aborted: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let gameID = req.body.gameID;
  let userID = req.body.userID;

  //check if the host is aborting and if so, remove everyone
  if (gameID) {
    // delete users;
    const playerQueryText = `DELETE FROM player WHERE game = $1`;
    let playerDeleteQuery = await runQuery(playerQueryText, [gameID]);

    //delete game
    const gameQueryText = `DELETE FROM game WHERE code = $1 `;
    let gameDeleteQuery = await runQuery(gameQueryText, [gameID]);

    res.status(200).json({ aborted: true });
  } else {
    //   delete user;
    const playerQueryText = `DELETE FROM player WHERE code = $1`;
    let playerDeleteQuery = await runQuery(playerQueryText, [userID]);
    res.status(200).json({ aborted: true });
  }
}
