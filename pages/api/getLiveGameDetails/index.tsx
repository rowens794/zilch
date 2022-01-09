import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../utils/dbInteraction";

interface Player {
  name?: string | null;
  score?: number | null;
  host?: boolean | null;
  code?: string | null;
}

interface Data {
  playerList: Player[];
  activePlayer: string;
  gameStarted: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // generate a unique game ID and get host name
  let { gameID }: { gameID: string } = req.body;

  //get scoreboard details
  let playerList = await getPlayers(gameID);

  //find host code
  let { activePlayer, gameStarted } = await getGameDetails(gameID);

  //respond with game code
  res.status(200).json({ playerList, activePlayer, gameStarted });
  //
}

const getPlayers = (gameID: string): Promise<Player[]> => {
  let promise = new Promise<Player[]>(async (resolve, reject) => {
    const playersQueryText = {
      text: `SELECT name, score, host, code FROM player WHERE game = $1`,
      values: [gameID],
    };
    let playersQuery = await runQuery(playersQueryText);

    while (playersQuery.rows.length < 8) {
      playersQuery.rows.push({
        name: null,
        score: null,
        host: false,
        code: null,
      });
    }

    resolve(playersQuery.rows);
  });

  return promise;
};

interface GameDetails {
  activePlayer: string;
  gameStarted: boolean;
}

const getGameDetails = (gameID: string): Promise<GameDetails> => {
  let promise = new Promise<GameDetails>(async (resolve, reject) => {
    const playersQueryText = {
      text: `SELECT activeplayer, game_started FROM game WHERE code = $1`,
      values: [gameID],
    };
    let game = await runQuery(playersQueryText);

    resolve({
      activePlayer: game.rows[0].activeplayer,
      gameStarted: game.rows[0].game_started,
    });
  });

  return promise;
};
