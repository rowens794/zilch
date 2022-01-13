export interface Game {
  code: string;
  game_started: boolean;
  game_stage: number;
  turn: number;
  players: string[];
  active_player: string;
  creation_date: Date;
  dice_values: number[];
  used_dice: number[];
  dice_selection: boolean[];
  roll_id: string;
  zilched: boolean | null;
  zilch_animation_start: Date | null;
  zilch_animation_end: Date | null;
  next_up: boolean | null;
  next_up_animation_start: Date | null;
  next_up_animation_end: Date | null;
  banked_score: boolean | null;
  banked_score_animation_start: Date | null;
  banked_score_animation_end: Date | null;
  roll_animation_end: Date | null;
  start_of_turn: boolean;
  board_cleared: boolean | null;
}

export function emptyGame(): Game {
  return {
    code: "",
    game_started: true,
    game_stage: 1,
    turn: 0,
    players: [""],
    active_player: "",
    creation_date: new Date(),
    dice_values: [1, 1, 1, 1, 1, 1],
    used_dice: [0, 0, 0, 0, 0, 0],
    dice_selection: [false, false, false, false, false, false],
    roll_id: "",
    zilched: false,
    zilch_animation_start: null,
    zilch_animation_end: null,
    next_up: null,
    next_up_animation_start: null,
    next_up_animation_end: null,
    banked_score: null,
    banked_score_animation_start: null,
    banked_score_animation_end: null,
    roll_animation_end: null,
    start_of_turn: true,
    board_cleared: false,
  };
}

export interface Player {
  name: string;
  game: string;
  turn_score: number;
  banked_score: number;
  host: boolean | null;
  code: string;
  creation_date: Date;
}

export function emptyPlayer(): Player {
  return {
    name: "",
    game: "",
    turn_score: 0,
    banked_score: 0,
    host: false,
    code: "",
    creation_date: new Date(),
  };
}

export interface Score {
  rollScore: number;
  turnScore: number;
  didZilch: boolean;
  validSelection: boolean;
  clearedBoard: boolean;
}

export function emptyScore(): Score {
  return {
    rollScore: 0,
    turnScore: 0,
    didZilch: false,
    validSelection: false,
    clearedBoard: false,
  };
}

export interface GameData {
  playerList: Player[];
  game: Game;
  activePlayer: {
    name: string;
    userID: string;
  };
}

export function emptyGameData(): GameData {
  return {
    playerList: [
      emptyPlayer(),
      emptyPlayer(),
      emptyPlayer(),
      emptyPlayer(),
      emptyPlayer(),
      emptyPlayer(),
      emptyPlayer(),
      emptyPlayer(),
    ],
    game: emptyGame(),
    activePlayer: {
      name: "",
      userID: "",
    },
  };
}
