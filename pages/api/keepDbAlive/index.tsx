import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../utils/dbInteraction";
import { makeID } from "../../../utils/utilityFunctions";

type Data = {
  gameID: string;
  userID: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // generate a unique game ID and get host name
  let playerName: string = "ANON123";
  let gameID = null;
  while (!gameID) {
    gameID = makeID(3);
    let games = await runQuery("SELECT * FROM game WHERE code = $1", [gameID]);
    if (games.rows.length > 0) gameID = null;
  }

  //generate a unique user
  let userID = null;
  while (!userID) {
    userID = makeID(6);
    let players = await runQuery("SELECT * FROM player WHERE code = $1", [
      userID,
    ]);
    if (players.rows.length > 0) userID = null;
  }

  //setup game dice variables
  let diceValues = [1, 1, 1, 1, 1, 1];
  let usedDice = [0, 0, 0, 0, 0, 0];
  let diceSelection = [false, false, false, false, false, false];

  //create a new game
  const gameQueryText =
    "INSERT INTO game(code, game_started, creation_date, dice_values, used_dice, dice_selection, start_of_turn, roll_animation_end, game_stage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
  await runQuery(gameQueryText, [
    gameID,
    false,
    new Date(),
    diceValues,
    usedDice,
    diceSelection,
    true,
    null,
    1,
  ]);

  //create a new user
  const userQueryText =
    "INSERT INTO player(code, game, name, banked_score, turn_score, host, creation_date) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  await runQuery(userQueryText, [
    userID,
    gameID,
    playerName,
    0,
    0,
    true,
    new Date(),
  ]);

  //respond with game code
  res.status(200).json({ gameID, userID });
}
