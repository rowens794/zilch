import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../../utils/dbInteraction";
import { Game, Player } from "../../../../utils/interfaces";

interface Data {
  status: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let gameID: string = req.body.gameID;
  let userID: string = req.body.userID;

  let player = await getPlayer(userID);

  //set Animation
  let bankScoreAnimationStart = new Date();
  let bankScoreAnimationEnd = new Date();
  let nextUpAnimationStart = new Date();
  let nextUpAnimationEnd = new Date();
  let last_turn_animation_start = null;
  let last_turn_animation_end = null;
  let last_turn_triggered = null;
  let last_turn_triggered_by = null;

  bankScoreAnimationStart.setSeconds(bankScoreAnimationStart.getSeconds() + 0);
  bankScoreAnimationEnd.setSeconds(bankScoreAnimationStart.getSeconds() + 2);
  nextUpAnimationStart.setSeconds(bankScoreAnimationStart.getSeconds() + 2);
  nextUpAnimationEnd.setSeconds(bankScoreAnimationStart.getSeconds() + 4);

  //check if the user has surpassed final score and if so set trigger and announce to players
  if (player.turn_score + player.banked_score >= 10000) {
    last_turn_animation_start = new Date();
    last_turn_animation_end = new Date();
    last_turn_animation_start.setSeconds(
      bankScoreAnimationStart.getSeconds() + 4
    );
    last_turn_animation_end.setSeconds(
      bankScoreAnimationStart.getSeconds() + 6
    );
    last_turn_triggered_by = player.code;
  }

  //update game with bank_score info
  await updateGame(
    gameID,
    bankScoreAnimationStart,
    bankScoreAnimationEnd,
    nextUpAnimationStart,
    nextUpAnimationEnd,
    last_turn_animation_start,
    last_turn_animation_end,
    last_turn_triggered,
    last_turn_triggered_by
  );

  //update turn_score on player document
  await updatePlayerBankScore(userID, player.turn_score + player.banked_score);

  res.status(200).json({
    status: "success",
  });
}

const getPlayer = (gameID: string): Promise<Player> => {
  let promise: Promise<Player> = new Promise(async (resolve, reject) => {
    const gameQueryText = `SELECT * FROM player WHERE code = $1`;
    let gameStartedQuery = await runQuery(gameQueryText, [gameID]);

    resolve(gameStartedQuery.rows[0]);
  });

  return promise;
};

const updatePlayerBankScore = (
  userID: string,
  newBankScore: number
): Promise<null> => {
  let promise: Promise<null> = new Promise(async (resolve, reject) => {
    const updateGame = `UPDATE player SET banked_score = $1, turn_score=$2 WHERE code = $3;`;
    await runQuery(updateGame, [newBankScore, 0, userID]);

    resolve(null);
  });

  return promise;
};

const updateGame = (
  gameID: string,
  bankScoreAnimationStart: Date,
  bankScoreAnimationEnd: Date,
  nextUpAnimationStart: Date,
  nextUpAnimationEnd: Date,
  last_turn_animation_start: Date | null,
  last_turn_animation_end: Date | null,
  last_turn_triggered: boolean | null,
  last_turn_triggered_by: string | null
): Promise<null> => {
  let promise: Promise<null> = new Promise(async (resolve, reject) => {
    const updateGame = `
      UPDATE game 
      SET 
        banked_score_animation_start = $1, 
        banked_score_animation_end=$2, 
        next_up_animation_start=$3, 
        next_up_animation_end=$4,
        last_turn_animation_start=$5,
        last_turn_animation_end=$6,
        last_turn_triggered=$7,
        last_turn_triggered_by=$8
      WHERE code = $9;
      `;
    await runQuery(updateGame, [
      bankScoreAnimationStart,
      bankScoreAnimationEnd,
      nextUpAnimationStart,
      nextUpAnimationEnd,
      last_turn_animation_start,
      last_turn_animation_end,
      last_turn_triggered,
      last_turn_triggered_by,
      gameID,
    ]);

    resolve(null);
  });

  return promise;
};
