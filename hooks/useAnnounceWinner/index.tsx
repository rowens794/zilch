import { useState, useEffect } from "react";
import { Game } from "../../utils/interfaces";

//simple custom hook to redirect players to winner announcement on game end
export const useAnnounceWinner = (game: Game) => {
  const [gameStage, setGameStage] = useState(1);

  useEffect(() => {
    //test to redirect if field is true
    if (game.announce_winner) {
      window.location.href = `/winners-circle/${game.code}`;
    }
  }, [game]);

  return { gameStage, setGameStage };
};
