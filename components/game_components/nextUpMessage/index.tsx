import React, { ReactElement, useState, useEffect } from "react";
import { GameData } from "../../../utils/interfaces";

interface Props {
  gameData: GameData;
  userID: string;
}

export default function Index({ gameData, userID }: Props): ReactElement {
  let [showNextUp, setShowNextUp] = useState(false);
  let [nextUpName, setNextUpName] = useState("");

  useEffect(() => {
    getName(gameData, userID, setNextUpName);
    showMessage(gameData, setShowNextUp);
  }, [gameData, userID, gameData.game.zilched]);

  return (
    <>
      {showNextUp ? (
        <div className="absolute z-30 w-full top-60">
          <div className="py-8 m-auto text-center transform bg-red-100 rounded-sm w-80 drop-shadow-harshDkRed -rotate-6">
            <p className="text-4xl font-black text-center text-yellow-500 text-shadow">
              {nextUpName}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

const showMessage = (gameData: GameData, setDisplayAnimation: Function) => {
  if (gameData.game.next_up) {
    setDisplayAnimation(true);
  } else {
    setDisplayAnimation(false);
  }
};

//function to diplay the name of the upcoming player
const getName = (
  gameData: GameData,
  userID: string,
  setPlayerName: Function
) => {
  let currentPlayerID = gameData.activePlayer.userID;
  let players = gameData.game.players;
  let activePlayerIndex = players.indexOf(currentPlayerID);

  const createPlayerNameString = (
    nextPlayerID: string,
    userID: string,
    nextPlayerName: string,
    setPlayerName: Function
  ) => {
    if (nextPlayerID === userID) {
      setPlayerName("You are up");
    } else {
      setPlayerName(`${nextPlayerName} is up`);
    }
  };

  if (activePlayerIndex + 1 === players.length) {
    let nextPlayer = gameData.playerList[activePlayerIndex];
    createPlayerNameString(
      nextPlayer.code,
      userID,
      nextPlayer.name,
      setPlayerName
    );
  } else if (activePlayerIndex === 0) {
    let nextPlayer = gameData.playerList[0];
    createPlayerNameString(
      nextPlayer.code,
      userID,
      nextPlayer.name,
      setPlayerName
    );
  } else {
    let nextPlayer = gameData.playerList[activePlayerIndex];
    createPlayerNameString(
      nextPlayer.code,
      userID,
      nextPlayer.name,
      setPlayerName
    );
  }
};
