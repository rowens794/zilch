import React, { ReactElement, useState, useEffect } from "react";
import Scoreboard from "../../../components/game_components/scoreboard";
import RollScore from "../../../components/game_components/rollScore";
import WhosRolling from "../../../components/game_components/whosRolling";
import GameBoard from "../../../components/game_components/gameBoard";
import ActionButtons from "../../../components/game_components/actionButtons";
import Zilch from "../../../components/game_components/zilchedMessage";
import NextUp from "../../../components/game_components/nextUpMessage";
import BankedPoints from "../../../components/game_components/bankedPointsMessage";
import { Player, Game, GameData } from "../../../utils/interfaces";

//custom hooks
import { useGetGameData } from "../../../hooks/useGetGameData";
import { useGetScore } from "../../../hooks/useGetScore";
import { useGameStage } from "../../../hooks/useGameStage";

interface Props {
  gameID: string;
  userID: string;
  initialGameData: GameData;
}

export default function Index({
  gameID,
  userID,
  initialGameData,
}: Props): ReactElement {
  //state
  const [selection, setSelection] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  //custom hooks
  const gameData = useGetGameData(gameID, userID, 500, initialGameData); //retrieves game data every XXXX milliseconds
  const stage = useGameStage(gameData.game); //includes function to set stage + checks to auto-increment stage
  const score = useGetScore(gameData, selection);

  //function to hit api and roll dice
  function initiateRoll() {
    //set game stage to 2: which means dice are in motion
    stage.setGameStage(2);
    let response = fetch(`/api/game/initiateRoll`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID, userID }), // body data type must match "Content-Type" header
    });

    return;
  }

  const takePoints = () => {
    stage.setGameStage(2);
    setSelection([false, false, false, false, false, false]);
    let response = fetch(`/api/game/takePoints`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID, userID, selection }), // body data type must match "Content-Type" header
    });
  };

  const bankPoints = () => {
    let response = fetch(`/api/game/bankPoints`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID, userID }), // body data type must match "Content-Type" header
    });
  };

  const actionFunctions = {
    rollDice: initiateRoll,
    takePoints: takePoints,
    bankPoints: bankPoints,
  };

  return (
    <div className="relative w-full h-screen max-w-sm m-auto bg-red-700">
      <GameBoard
        gameData={gameData}
        selection={selection}
        setSelection={setSelection}
        userID={userID}
      />
      <ActionButtons
        gameStage={stage.gameStage}
        displayActions={gameData.activePlayer.userID === userID}
        score={score}
        actionFunctions={actionFunctions}
      />
      <WhosRolling
        displayPlayerName={gameData.activePlayer.userID !== userID}
        playerName={gameData.activePlayer.name}
      />
      <RollScore
        turnScore={score.turnScore}
        rollScore={score.rollScore}
        gameStage={stage.gameStage}
        validSelection={true}
      />
      <Zilch gameData={gameData} userID={userID} />
      <NextUp gameData={gameData} userID={userID} />
      <BankedPoints gameData={gameData} userID={userID} />
      <div className="absolute w-full bottom-8">
        <Scoreboard
          data={gameData.playerList}
          activeUser={gameData.activePlayer.userID}
        />
      </div>
    </div>
  );
}

interface Props {}

export async function getServerSideProps(context: any) {
  let { gameID, userID } = context.params;

  const protocol = context.req.headers["x-forwarded-proto"] || "http";
  const baseUrl = context ? `${protocol}://${context.req.headers.host}` : "";

  let response = await fetch(`${baseUrl}/api/game/getLiveGameDetails`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameID, userID }), // body data type must match "Content-Type" header
  });

  let res = await response.json();

  return {
    props: {
      ...context.params,
      initialGameData: res,
    },
  };
}
