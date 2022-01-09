import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../utils/dbInteraction";

type Data = {
  gameID: string;
  userID: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // generate a unique game ID and get host name
  let playerName: string = req.body.name;
  let gameID = null;
  while (!gameID) {
    gameID = makeID();
    let games = await runQuery("SELECT * FROM game WHERE code = $1", [gameID]);
    if (games.rows.length > 0) gameID = null;
  }

  //generate a unique user
  let userID = null;
  while (!userID) {
    userID = makeID();
    let players = await runQuery("SELECT * FROM player WHERE code = $1", [
      userID,
    ]);
    if (players.rows.length > 0) userID = null;
  }

  //setup game dice variables

  // dice_values       INT[],
  // used_dice         INT[],
  // dice_selection    BOOL[]

  let diceValues = [0, 0, 0, 0, 0, 0];
  let usedDice = [0, 0, 0, 0, 0, 0];
  let diceSelection = [false, false, false, false, false, false];

  //create a new game
  const gameQueryText =
    "INSERT INTO game(code, game_started, turn, creation_date, dice_values, used_dice, dice_selection) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  await runQuery(gameQueryText, [
    gameID,
    false,
    0,
    new Date(),
    diceValues,
    usedDice,
    diceSelection,
  ]);

  //create a new user
  const userQueryText =
    "INSERT INTO player(code, game, name, score, host, creation_date) VALUES ($1, $2, $3, $4, $5, $6)";
  await runQuery(userQueryText, [
    userID,
    gameID,
    playerName,
    0,
    true,
    new Date(),
  ]);

  //respond with game code
  res.status(200).json({ gameID, userID });
}

//Generating unique id
function makeID(): string {
  const alphabet = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  var char = "";
  for (let i = 0; i < 6; i += 1) {
    let rand = Math.floor(Math.random() * alphabet.length);
    char += alphabet[rand].toUpperCase(); //alphanumeric chars
  }
  return char;
}
