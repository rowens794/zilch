import { useState, useEffect } from "react";
import { emptyPlayer, emptyScore, GameData } from "../../utils/interfaces";
import { countScore } from "../../utils/scoreCounter";

// this hook automatically calculates a rolls score, whether the player has zilched
// and other metrics every time a roll or new dice selection occurs
export const useGetScore = (gameData: GameData, selection: boolean[]) => {
  //initialize state with dummy data
  const [score, setScore] = useState(emptyScore());

  useEffect(() => {
    //do something here to calculate all of the necessary stuff
    let { score, validSelection, clearedBoard, zilched } = countScore(
      gameData.game.dice_values,
      selection,
      gameData.game.used_dice
    );

    //find the active player
    let activePlayerCode = gameData.game.active_player;
    let activePlayer = emptyPlayer();
    gameData.playerList.forEach((player) => {
      if (player.code === activePlayerCode) {
        activePlayer = player;
      }
    });

    setScore({
      rollScore: score,
      turnScore: activePlayer.turn_score,
      didZilch: zilched,
      validSelection: validSelection,
      clearedBoard: clearedBoard,
    });
  }, [gameData, selection]);

  return score;
};
