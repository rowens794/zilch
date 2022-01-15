import { useState, useEffect } from "react";
import { Game } from "../../utils/interfaces";

export const useAnnounceWinner = (game: Game) => {
  const [gameStage, setGameStage] = useState(1);

  useEffect(() => {
    //test to increment game stage on animation end
    if (game.announce_winner) {
      window.location.href = `/winners-circle/${game.code}`;
    }
  }, [game]);

  return { gameStage, setGameStage };
};
