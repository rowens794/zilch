import React, { ReactElement, useState, useEffect } from "react";
import { GameData } from "../../../utils/interfaces";

interface Props {
  gameData: GameData;
  userID: string;
}

export default function Index({ gameData, userID }: Props): ReactElement {
  let [showLastTurn, setShowLastTurn] = useState(false);

  useEffect(() => {
    showMessage(gameData, setShowLastTurn);
  }, [gameData, userID, gameData.game.last_turn_animation_end]);

  let playerCode = gameData.game.last_turn_triggered_by;
  let hero = gameData.playerList.filter((player) => {
    return player.code === playerCode;
  })[0];

  return (
    <>
      {showLastTurn ? (
        <div className="absolute z-30 w-full top-60">
          <div className="py-8 m-auto text-center transform rounded-sm bg-green-50 w-80 drop-shadow-harshDkRed -rotate-6">
            <p className="text-4xl font-black text-center text-green-500 text-shadow-md-green">
              {hero.name} hit 10K
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

const showMessage = (gameData: GameData, setDisplayAnimation: Function) => {
  if (gameData.game.last_turn_triggered) {
    setDisplayAnimation(true);
  } else {
    setDisplayAnimation(false);
  }
};
