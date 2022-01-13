import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../../utils/dbInteraction";
import { Game } from "../../../../utils/interfaces";
import { countScore } from "../../../../utils/scoreCounter";

interface Data {
  status: string;
  rollId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let gameID: string = req.body.gameID;
  let userID: string = req.body.userID;
  let diceSelections: boolean[] = req.body.selection;

  let game = await getGame(gameID);

  //calculate score
  let { score, clearedBoard } = countScore(
    game.dice_values,
    diceSelections,
    game.used_dice
  );

  //update usedDice
  let updatedUsedDice = game.used_dice;
  diceSelections.forEach((selectedDie, i) => {
    if (selectedDie) updatedUsedDice[i] = game.dice_values[i];
    if (game.used_dice[i]) updatedUsedDice[i] = game.used_dice[i];
  });

  //update player document w/ score & reset board if cleared
  await updatePlayerTurnScore(userID, score);

  //update game document w/ used_dice & selected dice
  await updateGame(gameID, updatedUsedDice, diceSelections, clearedBoard);

  res.status(200).json({
    status: "success",
    rollId: "",
  });
}

const getGame = (gameID: string): Promise<Game> => {
  let promise: Promise<Game> = new Promise(async (resolve, reject) => {
    const gameQueryText = `SELECT * FROM game WHERE code = $1`;
    let gameStartedQuery = await runQuery(gameQueryText, [gameID]);

    resolve(gameStartedQuery.rows[0]);
  });

  return promise;
};

const updatePlayerTurnScore = (
  userID: string,
  turnScore: number
): Promise<null> => {
  let promise: Promise<null> = new Promise(async (resolve, reject) => {
    const updateGame = `UPDATE player SET turn_score = turn_score + $1 WHERE code = $2;`;
    await runQuery(updateGame, [turnScore, userID]);

    resolve(null);
  });

  return promise;
};

const updateGame = (
  gameID: string,
  usedDice: number[],
  diceSelection: boolean[],
  clearedBoard: boolean
): Promise<null> => {
  let promise: Promise<null> = new Promise(async (resolve, reject) => {
    if (clearedBoard) {
      //todo
      const updateGame = `UPDATE game SET game_stage = $1, used_dice = $2, dice_selection=$3, board_cleared=$4 WHERE code = $5;`;
      await runQuery(updateGame, [
        4,
        usedDice,
        diceSelection,
        clearedBoard,
        gameID,
      ]);
    } else {
      const updateGame = `UPDATE game SET game_stage = $1, used_dice = $2, dice_selection=$3 WHERE code = $4;`;
      await runQuery(updateGame, [4, usedDice, diceSelection, gameID]);
    }

    resolve(null);
  });

  return promise;
};
