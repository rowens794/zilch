import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../utils/dbInteraction";

type Data = {
  gameStatus: boolean | null;
  playerList: string[];
  isHost: boolean | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // generate a unique game ID and get host name
  let { gameID, userID }: { gameID: string; userID: string } = req.body;

  //get lobby screen status details
  let gameStatus = await getGameStatus(gameID);
  let playerList = await getPlayers(gameID);
  let isHost = await getHostStatus(userID);

  //find host code

  //respond with game code
  res.status(200).json({ gameStatus, playerList, isHost });
}

const getGameStatus = (gameID: string): Promise<boolean | null> => {
  let promise = new Promise<boolean>(async (resolve, reject) => {
    const gameQueryText = `SELECT game_started FROM game WHERE code = $1`;
    let gameStartedQuery = await runQuery(gameQueryText, [gameID]);
    let gameStarted = null;
    if (gameStartedQuery.rows[0]) {
      gameStarted = gameStartedQuery.rows[0].game_started;
    }

    resolve(gameStarted);
  });

  return promise;
};

const getPlayers = (gameID: string): Promise<string[]> => {
  let promise = new Promise<string[]>(async (resolve, reject) => {
    const playersQueryText = `SELECT name, host FROM player WHERE game = $1`;
    let playersQuery = await runQuery(playersQueryText, [gameID]);
    let players = playersQuery.rows;

    // let playerList = players.map((player: { name: string; host: boolean }) => {
    let playerList = [];
    for (let i = 0; i < 8; i++) {
      let player = players[i];

      if (player) {
        let name = player.name;
        if (player.host) name = name + " (H)";
        if (playerList.indexOf(name) > -1) {
          name = name + `-${countOccurancesOfName(name, playerList)}`;
        }
        playerList.push(name);
      } else {
        playerList.push("");
      }
    }

    resolve(playerList);
  });

  return promise;
};

const getHostStatus = (userID: string): Promise<boolean | null> => {
  let promise = new Promise<boolean>(async (resolve, reject) => {
    const isPlayerHostQueryText = `SELECT host FROM player WHERE code = $1`;
    let isPlayerHostQuery = await runQuery(isPlayerHostQueryText, [userID]);
    let isPlayerHost = null;
    if (isPlayerHostQuery.rows[0]) {
      isPlayerHost = isPlayerHostQuery.rows[0].host;
    }

    resolve(isPlayerHost);
  });

  return promise;
};

const countOccurancesOfName = (name: string, array: string[]) => {
  let count = 1;

  for (const itemName of array) {
    if (name === itemName) count += 1;
  }

  return count;
};
