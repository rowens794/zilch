import type { NextApiRequest, NextApiResponse } from "next";
import { runQuery } from "../../../../utils/dbInteraction";
import { Game, Player } from "../../../../utils/interfaces";

interface Data {
  playerList: Player[];
  game: Game;
  activePlayer: {
    name: string;
    userID: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // generate a unique game ID and get host name
  let { gameID, userID }: { gameID: string; userID: string } = req.body;

  //get scoreboard details
  let playerList = await getPlayers(gameID);

  //getGameDetails
  let game = await getGame(gameID);

  //check if roll animation should be stopped
  if (game.roll_animation_end && game.roll_animation_end < new Date()) {
    await stopRollAnimation(gameID);
  }

  //check if game should be ended
  if (
    game.last_turn_triggered_by === game.active_player &&
    game.start_of_turn === true
  ) {
    await announceWinner(gameID);
  }

  //Host activities - These will only execute on host's request (to prevent multiple executions)
  let isHostRequest = checkIfRequestIsHost(userID, playerList);
  if (isHostRequest) {
    let transitionOnZilch = await checkZilch(game); // starts and stops zilch animations for all players
    if (transitionOnZilch) await clearPlayerScore(game); // clears the player's scores if zilch occurs
    let transitionOnBank = await checkBank(game); // starts the bank animation process
    if (transitionOnBank) await bankPlayerScore(game); // clears the player's scores on bank
    if (transitionOnZilch || transitionOnBank) await transitionPlayer(game);
    if (game.last_turn_animation_end) await checkLastTurn(game); //checks and sets last_turn appropriotely
    checkNextUp(game); //checks and sets next_up appropriotely
  }

  let activePlayerName = getName(playerList, game.active_player);

  //respond with game code
  res.status(200).json({
    playerList,
    game,
    activePlayer: { name: activePlayerName, userID: game.active_player },
  });
  //
}

const getPlayers = (gameID: string): Promise<Player[]> => {
  let promise = new Promise<Player[]>(async (resolve, reject) => {
    const playersQueryText = {
      text: `SELECT * FROM player WHERE game = $1`,
      values: [gameID],
    };
    let playersQuery = await runQuery(playersQueryText);
    let players: Player[] = playersQuery.rows;
    players.sort((a, b) => Number(a.creation_date) - Number(b.creation_date));

    while (playersQuery.rows.length < 8) {
      playersQuery.rows.push({
        name: null,
        score: null,
        host: false,
        code: null,
      });
    }

    resolve(playersQuery.rows);
  });

  return promise;
};

const getGame = (gameID: string): Promise<Game> => {
  let promise = new Promise<Game>(async (resolve, reject) => {
    const gameQueryText = `SELECT * FROM game WHERE code = $1`;
    let game = await runQuery(gameQueryText, [gameID]);

    resolve(game.rows[0]);
  });

  return promise;
};

const getName = (playerList: Player[], activePlayer: string): string => {
  let name: string | undefined = "";
  playerList.forEach((player) => {
    if (player.code === activePlayer && player.name !== null) {
      name = player.name;
    }
  });

  return name;
};

const stopRollAnimation = (gameID: string): Promise<null> => {
  let promise = new Promise<null>(async (resolve, reject) => {
    const updateGame = `UPDATE game SET roll_animation_end = $1 WHERE code = $2;`;
    await runQuery(updateGame, [null, gameID]);
    resolve(null);
  });

  return promise;
};

const checkIfRequestIsHost = (userID: string, players: Player[]): boolean => {
  let isHost = false;
  players.forEach((player) => {
    if (player.host && player.code === userID) {
      isHost = true;
    }
  });
  return isHost;
};

//determines if the player transition process should begin
const checkZilch = (game: Game): Promise<boolean> => {
  const startZilchAnimation = (gameID: string): Promise<null> => {
    let promise = new Promise<null>(async (resolve, reject) => {
      const updateGame = `UPDATE game SET zilched=$1 WHERE code = $2;`;
      await runQuery(updateGame, [true, gameID]);
      resolve(null);
    });

    return promise;
  };

  const stopZilchAnimation = (gameID: string): Promise<null> => {
    let promise = new Promise<null>(async (resolve, reject) => {
      const updateGame = `UPDATE game SET zilched=$1, zilch_animation_start=$2, zilch_animation_end=$3 WHERE code = $4;`;
      await runQuery(updateGame, [null, null, null, gameID]);

      resolve(null);
    });

    return promise;
  };

  let gameID = game.code;

  let promise = new Promise<boolean>(async (resolve, reject) => {
    let transitionPlayer = false;
    //check if zilch animation should be started/stopped
    if (game.zilch_animation_start && game.zilch_animation_start < new Date()) {
      await startZilchAnimation(gameID);
    }

    if (game.zilch_animation_end && game.zilch_animation_end < new Date()) {
      transitionPlayer = true;
      await stopZilchAnimation(gameID);
    }

    resolve(transitionPlayer);
  });

  return promise;
};

//determines if the player transition process should begin
const checkBank = (game: Game): Promise<boolean> => {
  const startBankAnimation = (gameID: string): Promise<null> => {
    let promise = new Promise<null>(async (resolve, reject) => {
      const updateGame = `UPDATE game SET banked_score=$1 WHERE code = $2;`;
      await runQuery(updateGame, [true, gameID]);
      resolve(null);
    });

    return promise;
  };

  const stopBankAnimation = (gameID: string): Promise<null> => {
    let promise = new Promise<null>(async (resolve, reject) => {
      const updateGame = `UPDATE game SET banked_score=$1, banked_score_animation_start=$2, banked_score_animation_end=$3 WHERE code = $4;`;
      await runQuery(updateGame, [null, null, null, gameID]);

      resolve(null);
    });

    return promise;
  };

  let gameID = game.code;

  let promise = new Promise<boolean>(async (resolve, reject) => {
    let transitionPlayer = false;
    //check if zilch animation should be started/stopped
    if (
      game.banked_score_animation_start &&
      game.banked_score_animation_start < new Date()
    ) {
      await startBankAnimation(gameID);
    }

    if (
      game.banked_score_animation_end &&
      game.banked_score_animation_end < new Date()
    ) {
      transitionPlayer = true;
      await stopBankAnimation(gameID);
    }

    resolve(transitionPlayer);
  });

  return promise;
};

//determines if the player transition process should begin
const checkLastTurn = (game: Game): Promise<null> => {
  const stopLastTurnAnimation = (gameID: string): Promise<null> => {
    let promise = new Promise<null>(async (resolve, reject) => {
      const updateGame = `UPDATE game SET last_turn_animation_start=$1, last_turn_animation_end=$2, last_turn_triggered=$3 WHERE code = $4;`;
      await runQuery(updateGame, [null, null, null, gameID]);

      resolve(null);
    });

    return promise;
  };

  const startLastTurnAnimation = (gameID: string): Promise<null> => {
    let promise = new Promise<null>(async (resolve, reject) => {
      const updateGame = `UPDATE game SET last_turn_triggered=$1 WHERE code = $2;`;
      await runQuery(updateGame, [true, gameID]);

      resolve(null);
    });

    return promise;
  };

  let gameID = game.code;

  let promise = new Promise<null>(async (resolve, reject) => {
    let transitionPlayer = false;
    //check if last turn animation should be stopped

    if (
      game.last_turn_animation_start &&
      game.last_turn_animation_start < new Date()
    ) {
      await startLastTurnAnimation(gameID);
    }

    if (
      game.last_turn_animation_end &&
      game.last_turn_animation_end < new Date()
    ) {
      await stopLastTurnAnimation(gameID);
    }

    resolve(null);
  });

  return promise;
};

const checkNextUp = (game: Game): Promise<null> => {
  const startNextUpAnimation = (gameID: string): Promise<null> => {
    let promise = new Promise<null>(async (resolve, reject) => {
      const updateGame = `UPDATE game SET next_up=$1 WHERE code = $2;`;
      await runQuery(updateGame, [true, gameID]);
      resolve(null);
    });

    return promise;
  };

  const stopNextUpAnimation = (gameID: string): Promise<null> => {
    let promise = new Promise<null>(async (resolve, reject) => {
      const updateGame = `UPDATE game SET next_up=$1, next_up_animation_start=$2, next_up_animation_end=$3 WHERE code = $4;`;
      await runQuery(updateGame, [null, null, null, gameID]);

      resolve(null);
    });

    return promise;
  };

  let gameID = game.code;

  let promise = new Promise<null>(async (resolve, reject) => {
    //check if zilch animation should be started/stopped
    if (
      game.next_up_animation_start &&
      game.next_up_animation_start < new Date()
    ) {
      await startNextUpAnimation(gameID);
    }

    if (game.next_up_animation_end && game.next_up_animation_end < new Date()) {
      await stopNextUpAnimation(gameID);
    }

    resolve(null);
  });

  return promise;
};

const clearPlayerScore = (game: Game) => {
  let promise = new Promise<null>(async (resolve, reject) => {
    let playerID = game.active_player;
    const updateGame = `UPDATE player SET turn_score=$1 WHERE code = $2;`;
    await runQuery(updateGame, [0, playerID]);

    resolve(null);
  });
  return promise;
};

const bankPlayerScore = (game: Game) => {
  let promise = new Promise<null>(async (resolve, reject) => {
    let playerID = game.active_player;
    const updateGame = `UPDATE player SET banked_score = banked_score + turn_score, turn_score=$1 WHERE code = $2;`;
    await runQuery(updateGame, [0, playerID]);

    resolve(null);
  });
  return promise;
};

//resets the game board and activates next player
const transitionPlayer = (game: Game) => {
  const getNextPlayer = (activePlayer: string, allPlayers: string[]) => {
    let currentIndex = allPlayers.indexOf(activePlayer);
    let len = allPlayers.length;

    if (currentIndex + 1 < len) {
      return allPlayers[currentIndex + 1];
    } else {
      return allPlayers[0];
    }
  };

  let promise = new Promise<null>(async (resolve, reject) => {
    let nextPlayer = getNextPlayer(game.active_player, game.players);
    let gameID = game.code;

    //reset the game board
    const updateGame = `
    UPDATE game 
    SET 
      active_player = $1, 
      dice_values = $2, 
      used_dice = $3, 
      dice_selection = $4, 
      game_stage=$5,
      start_of_turn=$6,
      zilched=$7,
      roll_id=$8,
      roll_animation_end=$9,
      zilch_animation_end=$10,
      zilch_animation_start=$11,
      banked_score=$12,
      banked_score_animation_start=$13,
      banked_score_animation_end=$14
    WHERE code = $15;
  `;

    await runQuery(updateGame, [
      nextPlayer,
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [false, false, false, false, false, false],
      1,
      true,
      false,
      "",
      null,
      null,
      null,
      null,
      null,
      null,
      gameID,
    ]);

    resolve(null);
  });

  return promise;
};

const announceWinner = (gameID: string) => {
  let promise = new Promise(async (resolve, reject) => {
    const updateGame = `UPDATE game SET announce_winner = $1 WHERE code = $2;`;
    await runQuery(updateGame, [true, gameID]);
    resolve(null);
  });

  return promise;
};
