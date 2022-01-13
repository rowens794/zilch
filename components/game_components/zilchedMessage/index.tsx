import React, { ReactElement, useState, useEffect } from "react";
import { GameData } from "../../../utils/interfaces";

interface Props {
  gameData: GameData;
  userID: string;
}

export default function Index({ gameData, userID }: Props): ReactElement {
  let [displayAnimation, setDisplayAnimation] = useState(false);
  let [playerName, setPlayerName] = useState("");

  useEffect(() => {
    getName(gameData, userID, setPlayerName);
    showMessage(gameData, setDisplayAnimation);
  }, [gameData, userID, gameData.game.zilched]);

  return (
    <>
      {displayAnimation ? (
        <div className="absolute z-30 w-full top-60 animate-bounce">
          <div className="py-8 m-auto text-4xl font-black text-center text-red-600 transform bg-yellow-300 rounded-full w-80 drop-shadow-harshDkRed -rotate-6">
            <p className="text-4xl font-black text-center text-red-600 text-shadow-md-yellow">
              {playerName}
            </p>
            <p className="text-6xl font-black text-center text-red-600 text-shadow-md-yellow">
              Zilched!
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

const showMessage = (gameData: GameData, setDisplayAnimation: Function) => {
  if (gameData.game.zilched) {
    setDisplayAnimation(true);
  } else {
    setDisplayAnimation(false);
  }
};

const getName = (
  gameData: GameData,
  userID: string,
  setPlayerName: Function
) => {
  let playerName = gameData.activePlayerName
    ? gameData.activePlayerName.name
    : "";

  if (
    gameData.activePlayerName &&
    gameData.activePlayerName.userID === userID
  ) {
    playerName = "You";
  }

  setPlayerName(playerName);
};
