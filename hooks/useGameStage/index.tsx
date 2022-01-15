import { useState, useEffect } from "react";
import { Game } from "../../utils/interfaces";

// simple hook to advance the game stage as players take actions
export const useGameStage = (game: Game) => {
  const [gameStage, setGameStage] = useState(1);

  useEffect(() => {
    //test to increment game stage on animation end
    if (
      (gameStage === 2 && game.roll_animation_end === null) ||
      (game.game_stage === 2 && game.roll_animation_end === null)
    ) {
      setGameStage(3);
    } else {
      setGameStage(game.game_stage);
    }
  }, [game]);

  return { gameStage, setGameStage };
};
