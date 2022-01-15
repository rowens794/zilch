import { useState, useEffect } from "react";
import { GameData } from "../../utils/interfaces";

// this hook hits the server to retrieve updated game state every x number of milliseconds and
// puts it into the users state
export const useGetGameData = (
  gameID: string,
  userID: string,
  updateFreqency: number,
  initialGameData: GameData
) => {
  const [data, setGameData] = useState(initialGameData); //initialize state with dummy data
  useEffect(() => {
    const getGameDataPromise = (gameID: string) => {
      let promise = new Promise<GameData>(async (resolve, reject) => {
        const response = await fetch("/api/game/getLiveGameDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameID: gameID, userID: userID }),
        });

        let res = await response.json();

        resolve(res);
      });

      return promise;
    };

    const getGameData = (gameID: string) => {
      setInterval(async () => {
        let gameData = await getGameDataPromise(gameID);

        setGameData(gameData);
      }, updateFreqency);
    };

    getGameData(gameID);
  }, [gameID, updateFreqency, userID]);

  return data;
};
