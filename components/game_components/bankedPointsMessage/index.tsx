import React, { ReactElement, useState, useEffect } from "react";
import { GameData } from "../../../utils/interfaces";

interface Props {
  gameData: GameData;
  userID: string;
}

export default function Index({ gameData, userID }: Props): ReactElement {
  let [showBankedPoints, setShowBankedPoints] = useState(false);
  let [msg, setMsg] = useState("");

  useEffect(() => {
    getMsg(gameData, userID, setMsg);
    showMessage(gameData, setShowBankedPoints);
  }, [gameData, userID, gameData.game.banked_score]);

  return (
    <>
      {showBankedPoints ? (
        <div className="absolute z-30 w-full top-60">
          <div className="py-8 m-auto text-center transform rounded-sm bg-yellow-50 w-80 drop-shadow-harshDkRed -rotate-6">
            <p className="text-4xl font-black text-center text-yellow-500 text-shadow">
              {msg}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

const showMessage = (gameData: GameData, setDisplayAnimation: Function) => {
  if (gameData.game.banked_score) {
    setDisplayAnimation(true);
  } else {
    setDisplayAnimation(false);
  }
};

const getMsg = (gameData: GameData, userID: string, setMsg: Function) => {
  if (gameData.activePlayer.userID === userID) {
    setMsg("You've banked points");
  } else {
    setMsg(`${gameData.activePlayer.name} banked points`);
  }
};
