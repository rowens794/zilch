import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../../utils/dbInteraction";
import { Game } from "../../../../utils/interfaces";
import { makeID } from "../../../../utils/utilityFunctions";
import { countScore } from "../../../../utils/scoreCounter";

type Data = {
  status: string;
  rollId: string;
};

// initiate roll starts the process of rolling dice
// it performs the random generation of dice, sets the roll id, and sets an animation end time

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let gameID: string = req.body.gameID;
  let userID: string = req.body.userID;
  let game = await getGame(gameID);

  //check to make sure the correct player is rolling
  if (userID === game.active_player) {
    //Step 1: check if board has been cleared
    game = await resetGameBoardIfCleared(game);

    //step 2: update the dice values based on user's selections (selections are embedded in game)
    game = updateDiceValues(game);

    //step 3: set dice Animation end time given length of roll (in seconds)
    let diceAnimationEnd = generateDiceAnimationEndTime(2);

    //step 4: determine if user zilched
    let { zilched } = countScore(
      game.dice_values,
      game.dice_selection,
      game.board_cleared ? [] : game.used_dice
    );

    //step 5: generate zilch animation times if user zilched
    let {
      zilchAnimationStart,
      zilchAnimationEnd,
      nextUpAnimationStart,
      nextUpAnimationEnd,
    } = getZilchAnimationTimes(zilched, diceAnimationEnd);

    //step 7: update the game document
    let rollId = await updateGame(
      gameID,
      game.dice_values,
      diceAnimationEnd,
      zilched ? zilchAnimationStart : null,
      zilched ? zilchAnimationEnd : null,
      zilched ? nextUpAnimationStart : null,
      zilched ? nextUpAnimationEnd : null,
      game.board_cleared
    );

    //respond with game code
    res.status(200).json({
      status: "success",
      rollId,
    });
  } else {
    res.status(200).json({
      status: "failed",
      rollId: "",
    });
  }
}

const getGame = (gameID: string): Promise<Game> => {
  let promise: Promise<Game> = new Promise(async (resolve, reject) => {
    const gameQueryText = `SELECT * FROM game WHERE code = $1`;
    let gameStartedQuery = await runQuery(gameQueryText, [gameID]);

    resolve(gameStartedQuery.rows[0]);
  });

  return promise;
};

const updateGame = (
  gameID: string,
  diceValues: number[],
  animationEnd: Date,
  zilchAnimationStart: Date | null,
  zilchAnimationEnd: Date | null,
  nextUpAnimationStart: Date | null,
  nextUpAnimationEnd: Date | null,
  boardCleared: boolean | null
): Promise<string> => {
  let promise: Promise<string> = new Promise(async (resolve, reject) => {
    let roll_id = makeID(6);

    if (!boardCleared) {
      const updateGame = `
      UPDATE game 
      SET 
        start_of_turn = $1, 
        dice_values=$2, 
        roll_id=$3, 
        roll_animation_end=$4, 
        game_stage=$5, 
        zilch_animation_start = $6, 
        zilch_animation_end=$7,
        next_up_animation_start = $8, 
        next_up_animation_end=$9
      WHERE code = $10;`;
      await runQuery(updateGame, [
        false,
        diceValues,
        roll_id,
        animationEnd,
        2,
        zilchAnimationStart,
        zilchAnimationEnd,
        nextUpAnimationStart,
        nextUpAnimationEnd,
        gameID,
      ]);
    } else {
      const updateGame = `
      UPDATE game 
      SET 
        start_of_turn = $1, 
        dice_values=$2, 
        roll_id=$3, 
        roll_animation_end=$4, 
        game_stage=$5, 
        zilch_animation_start = $6, 
        zilch_animation_end=$7,
        next_up_animation_start = $8, 
        next_up_animation_end=$9,
        dice_selection=$10,
        board_cleared=$11
      WHERE code = $12;`;
      await runQuery(updateGame, [
        false,
        diceValues,
        roll_id,
        animationEnd,
        2,
        zilchAnimationStart,
        zilchAnimationEnd,
        nextUpAnimationStart,
        nextUpAnimationEnd,
        [false, false, false, false, false, false],
        null,
        gameID,
      ]);
    }

    resolve(roll_id);
  });

  return promise;
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const resetGameBoardIfCleared = (game: Game): Promise<Game> => {
  let promise: Promise<Game> = new Promise(async (resolve, reject) => {
    if (game.board_cleared) {
      const updateGame = `
      UPDATE game 
      SET 
        dice_selection=$1,
        dice_values=$2,
        used_dice=$3,
        board_cleared=$4
      WHERE code = $5;`;
      await runQuery(updateGame, [
        [false, false, false, false, false, false],
        [1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0],
        null,
        game.code,
      ]);

      //refetch the updated game
      let updatedGame = await getGame(game.code);
      resolve(updatedGame);
    } else {
      resolve(game);
    }
  });

  return promise;
};

const updateDiceValues = (game: Game): Game => {
  for (let i = 0; i < 6; i++) {
    let diceUsed = game.used_dice[i];
    if (!diceUsed) {
      let newValue = randomIntFromInterval(1, 6);
      game.dice_values[i] = newValue;
    } else {
      game.dice_values[i] = game.used_dice[i];
    }
  }

  return game;
};

const generateDiceAnimationEndTime = (rollLength: number): Date => {
  let diceAnimationEnd = new Date();
  diceAnimationEnd.setSeconds(diceAnimationEnd.getSeconds() + rollLength);
  return diceAnimationEnd;
};

const getZilchAnimationTimes = (
  zilched: boolean,
  diceAnimationEnd: Date
): {
  zilchAnimationStart: Date | null;
  zilchAnimationEnd: Date | null;
  nextUpAnimationStart: Date | null;
  nextUpAnimationEnd: Date | null;
} => {
  if (zilched) {
    let zilchAnimationStart = new Date();
    let zilchAnimationEnd = new Date();
    let nextUpAnimationStart = new Date();
    let nextUpAnimationEnd = new Date();
    zilchAnimationStart.setSeconds(diceAnimationEnd.getSeconds() + 1);
    zilchAnimationEnd.setSeconds(diceAnimationEnd.getSeconds() + 3);
    nextUpAnimationStart.setSeconds(diceAnimationEnd.getSeconds() + 3);
    nextUpAnimationEnd.setSeconds(diceAnimationEnd.getSeconds() + 5);

    return {
      zilchAnimationStart: zilchAnimationStart,
      zilchAnimationEnd: zilchAnimationEnd,
      nextUpAnimationStart: nextUpAnimationStart,
      nextUpAnimationEnd: nextUpAnimationEnd,
    };
  } else {
    return {
      zilchAnimationStart: null,
      zilchAnimationEnd: null,
      nextUpAnimationStart: null,
      nextUpAnimationEnd: null,
    };
  }
};
