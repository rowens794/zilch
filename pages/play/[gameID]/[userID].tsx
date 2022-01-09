import React, { ReactElement, useState, useEffect } from "react";
import Scoreboard from "../../../components/game_components/scoreboard";
import GameBoard from "../../../components/game_components/gameBoard";
import ActionButtons from "../../../components/game_components/actionButtons";
import Zilched from "../../../components/game_components/zilchedMessage";
import { countScore } from "../../../utils/scoreCounter";

interface Props {
  gameID: string;
  userID: string;
  playerList: {
    name: string;
    score: number;
    host: boolean;
    code: string;
  }[];
  activePlayer: string;
}

export default function Index({
  gameID,
  userID,
  playerList,
  activePlayer,
}: Props): ReactElement {
  let [diceSelections, setDiceSelections] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  let [diceValues, setDiceValues] = useState([3, 5, 4, 2, 3, 1]);
  let [usedDice, setUsedDice] = useState([0, 0, 0, 0, 0, 0]);
  let [stage, setStage] = useState(1); //1. pre-roll 2. dice rolling 3. dice selection 4. decide to contine/end
  let [startOfTurn, setStartOfTurn] = useState(true); // keep track of whether it is the start of a players turn
  let [validSelection, setValidSelection] = useState(true); //keeps track of whether the users selection is valid
  let [rollScore, setRollScore] = useState(0); // keeps track of score for a single roll
  let [turnScore, setTurnScore] = useState(0); // keeps track of score for a single roll
  let [zilched, setZilched] = useState(false); // tracks whether player zilched
  let [boardCleared, setBoardCleared] = useState(false); // tracks whether player cleared the board
  let [players, setPlayers] = useState(playerList);
  let [activePlayerID, setActivePlayerID] = useState(activePlayer); //tracks the player that is currently active
  let [currentPlayerName, setCurrentPlayerName] = useState(playerList[0].name);

  //function to hit api and roll dice
  const rollDice = async () => {
    if (boardCleared) {
      //to start roll transition state to 2
      setStartOfTurn(false);
      setStage(2);
      setUsedDice([0, 0, 0, 0, 0, 0]);
      let roll = await rollDicePromise();
      setDiceValues(roll);

      //wait 2 seconds after roll and transition to state 3
      setTimeout(() => setStage(3), 1500);
    } else {
      //to start roll transition state to 2
      setStartOfTurn(false);
      setStage(2);
      let roll = await rollDicePromise();
      setDiceValues(roll);

      //wait 2 seconds after roll and transition to state 3
      setTimeout(() => setStage(3), 1500);
    }
  };

  const takePoints = async () => {
    //set usedDice
    let usedDiceCopy = [...usedDice];
    diceSelections.forEach((dice, i) => {
      if (dice) usedDiceCopy[i] = diceValues[i];
      setUsedDice(usedDiceCopy);
    });

    //reset selections
    setDiceSelections([false, false, false, false, false, false]);

    //set point total to api
    setTurnScore(turnScore + rollScore);
    setRollScore(0);
    setStage(4);
  };

  const bankPoints = () => {
    setTurnScore(0);

    //save turn score to db

    //pass active player to next in line
  };

  let actionButtonObject = {
    stage,
    rollScore,
    turnScore,
    validSelection,
    currentPlayerName,
    activePlayerID,
    userID,
    takePoints,
    rollDice,
    bankPoints,
  };

  let gameBoardObject = {
    diceSelections,
    diceValues,
    stage,
    startOfTurn,
    usedDice,
    setDiceSelections,
    setStage,
  };

  //useEffect to transition on Zilch || bank points
  useEffect(() => {
    const transitionPlayer = () => {
      setTimeout(() => {
        fetch("/api/game/nextPlayer", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameID }), // body data type must match "Content-Type" header
        }).then(() => {
          setStartOfTurn(true);
          setZilched(false);
          setTurnScore(0);
          setRollScore(0);
          setUsedDice([0, 0, 0, 0, 0, 0]);
          setStage(1);
        });
      }, 2000);
    };

    if (zilched && userID === activePlayerID) {
      transitionPlayer();
    }
  }, [zilched, gameID, userID, activePlayerID]);

  //useEffect to track turn 3
  useEffect(() => {
    // only run on stage 3
    if (stage === 3) {
      let [score, validSelection, clearedBoard, zilched] = countScore(
        diceValues,
        diceSelections,
        usedDice
      );

      setZilched(zilched);
      setValidSelection(validSelection);
      setBoardCleared(clearedBoard);

      //set the score
      if (validSelection) setRollScore(score);
      if (!validSelection) setRollScore(0);

      //determine if board should be reset
    }
  }, [diceValues, diceSelections, usedDice, stage]);

  //game pulse
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getLiveGameDetails", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameID, userID }), // body data type must match "Content-Type" header
        });

        let res = await response.json();

        setPlayers(res.playerList);
        setActivePlayerID(res.activePlayer);
        setCurrentPlayerName(getName(res.playerList, res.activePlayer));
      } catch (error) {
        console.log("error");
      }
    };

    fetchData();

    let interval = setInterval(fetchData, 3000); // save the id if the interval
    return () => clearInterval(interval);
  }, [gameID, userID]);

  return (
    <div className="bg-red-700 w-full h-screen relative max-w-sm m-auto">
      <Zilched showMessage={zilched} />
      <GameBoard gameBoardObject={gameBoardObject} />
      <ActionButtons actionButtonObject={actionButtonObject} />
      <div className="absolute bottom-8 w-full">
        <Scoreboard data={players} activeUser={activePlayerID} />
      </div>
    </div>
  );
}

interface Props {}

export async function getServerSideProps(context: any) {
  let { gameID, userID } = context.params;

  const protocol = context.req.headers["x-forwarded-proto"] || "http";
  const baseUrl = context ? `${protocol}://${context.req.headers.host}` : "";

  let response = await fetch(`${baseUrl}/api/getLiveGameDetails`, {
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
      ...res,
    },
  };
}

const rollDicePromise = () => {
  let promise: Promise<number[]> = new Promise((resolve, reject) => {
    fetch("/api/game/rollDice", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }), // body data type must match "Content-Type" header
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        resolve(res.roll);
      });
  });

  return promise;
};

const getName = (
  playerList: {
    name: string;
    score: number;
    host: boolean;
    code: string;
  }[],
  activePlayer: string
): string => {
  let name = "";
  playerList.forEach((player) => {
    if (player.code === activePlayer && player.name !== null) {
      name = player.name;
    }
  });

  return name;
};
