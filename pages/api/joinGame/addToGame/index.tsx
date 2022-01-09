import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../../utils/dbInteraction";

type Data = {
  gameID: string | null;
  userID: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let name: string = req.body.name;
  let gameID: string = req.body.gameID;

  //respond with gameID and userID
  let gameAvailableToJoin = await getGameStatus(gameID);
  if (gameAvailableToJoin) {
    let player = await createPlayer(gameID, name);
    res.status(200).json(player);
  } else {
    res.status(200).json({ gameID: null, userID: null });
  }
}

const getGameStatus = (gameID: string): Promise<boolean> => {
  let promise = new Promise<boolean>(async (resolve, reject) => {
    const gameQueryText = `SELECT game_started FROM game WHERE code = $1 AND game_started = false`;
    let gameStartedQuery = await runQuery(gameQueryText, [gameID]);
    let gameIsActive = false;
    if (gameStartedQuery.rows[0]) {
      gameIsActive = !gameStartedQuery.rows[0].game_started;
    }

    resolve(gameIsActive);
  });

  return promise;
};

const createPlayer = (gameID: string, name: string) => {
  let promise: Promise<{ gameID: string; userID: string }> = new Promise(
    async (resolve, reject) => {
      //create a user and attach to game
      let userID = null;
      while (!userID) {
        userID = makeID();
        let players = await runQuery("SELECT * FROM player WHERE code = $1", [
          userID,
        ]);
        if (players.rows.length > 0) userID = null;
      }

      //create a new user
      const userQueryText =
        "INSERT INTO player(code, game, name, score, host) VALUES ($1, $2, $3, $4, $5)";
      await runQuery(userQueryText, [userID, gameID, name, 0, false]);

      resolve({ userID, gameID });
    }
  );

  return promise;
};

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
