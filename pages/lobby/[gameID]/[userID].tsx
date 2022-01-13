import React, { ReactElement, useEffect, useState } from "react";
import PrimaryAction from "../../../components/buttons/primary-action";

interface Props {
  gameID: string;
  userID: string;
  playerList: string[];
  isHost: boolean;
  gameStarted: boolean;
}

export default function Index({
  gameID,
  userID,
  playerList,
  isHost,
  gameStarted,
}: Props): ReactElement {
  let [players, setPlayers] = useState(playerList);
  let [playerIsHost, setIsHost] = useState(isHost);
  let [gameHasStarted, setGameStarted] = useState(gameStarted);
  let [blinkingEllipse, setBlinkingEllipse] = useState("");
  let [clickedStart, setClickedStart] = useState(false);

  const abort = async () => {
    const response = await fetch("/api/abortGame", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID: isHost ? gameID : null, userID }), // body data type must match "Content-Type" header
    });

    let res = await response.json();

    //abort was executed successfully redirect to home page
    if (res.aborted) window.location.href = "/";
  };

  const startGame = async () => {
    const response = await fetch("/api/startGame", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID: isHost ? gameID : null, userID }), // body data type must match "Content-Type" header
    });

    let res = await response.json();

    //abort was executed successfully redirect to home page
    if (res.gameStarted) window.location.href = `/play/${gameID}/${userID}`;

    setClickedStart(true);
  };

  //refectch the game data every second
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getGameDetails", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameID, userID }), // body data type must match "Content-Type" header
        });

        let res = await response.json();

        //check if game has started
        if (res.gameStatus === true) {
          window.location.href = `/play/${gameID}/${userID}`;
        } else if (res.gameStatus === false) {
          setPlayers(res.playerList);
          setGameStarted(res.gameStatus);
          setIsHost(res.isHost);
        } else {
          //redirect to home
          window.location.href = `/`;
        }
      } catch (error) {
        console.log("error");
      }
    };

    fetchData();

    let interval = setInterval(fetchData, 3000); // save the id if the interval
    return () => clearInterval(interval);
  }, [gameID, userID]);

  //setup the blinking ellipse
  useEffect(() => {
    const setEllipse = () => {
      if (blinkingEllipse === "") setBlinkingEllipse(".");
      if (blinkingEllipse === ".") setBlinkingEllipse("..");
      if (blinkingEllipse === "..") setBlinkingEllipse("...");
      if (blinkingEllipse === "...") setBlinkingEllipse("");
    };

    let interval = setInterval(setEllipse, 500);
    return () => clearInterval(interval);
  }, [blinkingEllipse]);

  //check if game has started
  useEffect(() => {
    if (gameHasStarted) {
      window.location.href = `/game/${gameID}/${userID}`;
    }
  });

  return (
    <div className="bg-red-700 w-full h-screen relative flex justify-center">
      <div className="text-center mt-12 w-full">
        <p className="text-4xl font-extrabold text-shadow-lg text-white m-auto w-full text-center">
          ZILCH!
        </p>

        <p className="text-white text-shadow-md text-xl my-8">
          Game Code: {gameID}
        </p>

        {playerIsHost ? (
          <>
            {!clickedStart ? (
              <PrimaryAction label="Start Game!" action={() => startGame()} />
            ) : (
              <PrimaryAction label="Starting Up!" action={() => null} />
            )}
          </>
        ) : (
          <div className="relative w-48 m-auto">
            <p className="text-white font-bold mb-4 text-xl text-shadow w-full transform -rotate-2 bg-red-400 py-2 px-4 drop-shadow-harshDkRed">
              Waiting on host to start game
            </p>
            <p
              className="absolute w-4 text-left text-xl text-white font-bold text-shadow"
              style={{ bottom: "10px", right: "12px" }}
            >
              {blinkingEllipse}
            </p>
          </div>
        )}

        <div className=" mt-16 mb-10">
          <p className="text-white font-bold mb-4 text-2xl text-shadow">
            Players in Lobby
          </p>
          <div className="grid grid-cols-2 text-white text-lg text-shadow max-w-xs m-auto">
            {players.map((player, i) => {
              return (
                <p className=" w-full text-center h-8" key={i}>
                  {player}
                </p>
              );
            })}
          </div>
        </div>

        {isHost ? (
          <button
            className="text-white mt-16 text-shadow"
            onClick={() => abort()}
          >
            abort game
          </button>
        ) : (
          <button
            className="text-white mt-16 text-shadow"
            onClick={() => abort()}
          >
            abort game
          </button>
        )}
      </div>
    </div>
  );
}

interface Props {}

export async function getServerSideProps(context: any) {
  let { gameID, userID } = context.params;
  const protocol = context.req.headers["x-forwarded-proto"] || "http";
  const baseUrl = context ? `${protocol}://${context.req.headers.host}` : "";

  const res = await fetch(`${baseUrl}/api/getGameDetails`, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameID, userID }),
  });

  const json = await res.json();
  let { playerList, gameStatus, isHost } = json;

  return {
    props: {
      ...context.params,
      playerList,
      gameStatus,
      isHost,
    },
  };
}
