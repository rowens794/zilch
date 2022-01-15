import React, { ReactElement, useState } from "react";
import { EyeIcon } from "@heroicons/react/solid";

import Scoreboard from "../../../components/game_components/scoreboard";
import RollScore from "../../../components/game_components/rollScore";
import LastTurnWarning from "../../../components/game_components/lastTurnWarning";
import WhosRolling from "../../../components/game_components/whosRolling";
import GameBoard from "../../../components/game_components/gameBoard";
import ActionButtons from "../../../components/game_components/actionButtons";
import Zilch from "../../../components/game_components/zilchedMessage";
import NextUp from "../../../components/game_components/nextUpMessage";
import LastTurn from "../../../components/game_components/announceLastTurn";
import BankedPoints from "../../../components/game_components/bankedPointsMessage";
import RulesSlider from "../../../components/game_components/rulesSlider";
import { GameData } from "../../../utils/interfaces";

//custom hooks
import { useGetGameData } from "../../../hooks/useGetGameData";
import { useGetScore } from "../../../hooks/useGetScore";
import { useGameStage } from "../../../hooks/useGameStage";
import { useAnnounceWinner } from "../../../hooks/useAnnounceWinner";

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
  //keeps track of whether or not to show the rules panel during a game
  const [rulesOpen, setRulesOpen] = useState(false);
  //keeps track of showing users which dice they have selected during their turn
  const [selection, setSelection] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  //custom hooks
  const gameData = useGetGameData(gameID, userID, 500, initialGameData); //retrieves game state data every 500 milliseconds
  const stage = useGameStage(gameData.game); //sets game stage + checks to change stage as necessary based on game obj from db
  const score = useGetScore(gameData, selection); //calculates score of each roll along with zilch and selection analysis
  useAnnounceWinner(gameData.game); //runs a check to determine if winner should be announced and forwards to ending game page

  //function to hit api and roll dice at the server
  const initiateRoll = () => {
    //set game stage to 2: which means dice are in motion
    stage.setGameStage(2);
    fetch(`/api/game/initiateRoll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID, userID }),
    });

    return;
  };

  //function to take points of a single roll and continue turn ( at the server)
  const takePoints = () => {
    stage.setGameStage(2);
    setSelection([false, false, false, false, false, false]);
    fetch(`/api/game/takePoints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID, userID, selection }),
    });
  };

  //function to bank points of a turn end turn ( at the server)
  const bankPoints = () => {
    fetch(`/api/game/bankPoints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID, userID }),
    });
  };

  //three action functions above are put into an object for easier passing into component
  const actionFunctions = {
    rollDice: initiateRoll,
    takePoints: takePoints,
    bankPoints: bankPoints,
  };

  return (
    <div className="relative w-full h-full m-auto bg-red-700">
      {/* Rules Slider */}
      <button type="button" onClick={() => setRulesOpen(true)}>
        <EyeIcon className="absolute w-8 h-8 text-red-300 top-2 right-2" />
      </button>
      <RulesSlider open={rulesOpen} setOpen={setRulesOpen} />

      {/* Game Elements */}
      <GameBoard
        gameData={gameData}
        selection={selection}
        setSelection={setSelection}
      />
      <ActionButtons
        gameStage={stage.gameStage}
        displayActions={gameData.activePlayer.userID === userID}
        score={score}
        actionFunctions={actionFunctions}
        gameData={gameData}
      />
      <WhosRolling
        displayPlayerName={gameData.activePlayer.userID !== userID}
        playerName={gameData.activePlayer.name}
      />
      <RollScore
        turnScore={score.turnScore}
        rollScore={score.rollScore}
        gameStage={stage.gameStage}
        validSelection={score.validSelection}
      />
      <LastTurnWarning lastTurnID={gameData.game.last_turn_triggered_by} />

      <div className="absolute w-full bottom-8">
        <Scoreboard
          data={gameData.playerList}
          activeUser={gameData.activePlayer.userID}
        />
      </div>

      {/* game state notifications */}
      <Zilch gameData={gameData} userID={userID} />
      <NextUp gameData={gameData} userID={userID} />
      <BankedPoints gameData={gameData} userID={userID} />
      <LastTurn gameData={gameData} userID={userID} />
    </div>
  );
}

// Opportunity for Improvement
// is there a predefined type definition for context in getServerSideProps?

export async function getServerSideProps(context: any) {
  let { gameID, userID } = context.params;

  const protocol = context.req.headers["x-forwarded-proto"] || "http";
  const baseUrl = context ? `${protocol}://${context.req.headers.host}` : "";

  let response = await fetch(`${baseUrl}/api/game/getLiveGameDetails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameID, userID }),
  });

  let res = await response.json();

  return {
    props: {
      ...context.params,
      initialGameData: res,
    },
  };
}
