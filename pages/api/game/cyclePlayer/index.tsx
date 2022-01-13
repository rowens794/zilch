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
  let bankPoints: boolean = req.body.bankPoints;

  //retrieve the players participating in the game
  const gameQuery = `SELECT * FROM game WHERE code = $1;`;
  let game = await runQuery(gameQuery, [gameID]);
  let nextPlayer = getNextPlayer(
    game.rows[0].active_player,
    game.rows[0].players
  );

  //if the player chose to bank points update their score
  const updatePlayer = `UPDATE player SET turn_score = $1, banked_score=$2 WHERE code = $3;`;
  await runQuery(updatePlayer, [
    0,
    bankPoints ? game.rows[0].active_player : 0,
    game.rows[0].active_player,
  ]);

  //reset the game board
  const updateGame = `
    UPDATE game 
    SET 
      active_player = $1, 
      dice_values = $2, 
      used_dice = $3, 
      dice_selection = $4, 
      game_stage=$5,
      start_of_turn=$6,
      zilched=$7,
      roll_id=$8,
      roll_animation_end=$9,
      zilch_animation_end=$10
    WHERE code = $11;
  `;

  await runQuery(updateGame, [
    nextPlayer,
    [1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [false, false, false, false, false, false],
    1,
    true,
    false,
    "",
    null,
    null,
    gameID,
  ]);

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
