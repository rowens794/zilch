import React, { ReactElement } from "react";
import { GameData } from "../../../utils/interfaces";
import Dice from "../dice";

interface Props {
  gameData: GameData;
  selection: boolean[];
  setSelection: Function;
}

export default function index({
  gameData,
  selection,
  setSelection,
}: Props): ReactElement {
  let diceArray = [];
  let usedDice = gameData.game.used_dice;
  let dice_values = gameData.game.dice_values;
  let start_of_turn = gameData.game.start_of_turn;
  let animate_dice_roll = gameData.game.roll_animation_end !== null;

  for (let i = 0; i < 6; i++) {
    let dice = null;
    let isDiceSelected = selection[i];
    let isDiceAnimated = animate_dice_roll;
    let isDiceAlreadyUsed = usedDice[i];

    if (!usedDice[i]) {
      dice = (
        <Dice
          key={i}
          diceValues={dice_values}
          diceNumber={i}
          diceSelections={selection}
          setDiceSelections={setSelection}
          startOfTurn={start_of_turn}
          diceRotation={diceRotation[i]} // css to style each dice
          deadDice={start_of_turn ? true : false}
          animateDice={isDiceAnimated && !isDiceAlreadyUsed}
        />
      );
    } else {
      dice = (
        <Dice
          key={i}
          diceValues={dice_values}
          diceNumber={i}
          diceSelections={selection}
          setDiceSelections={setSelection}
          startOfTurn={start_of_turn}
          diceRotation={diceRotation[i]} // css to style each dice
          deadDice={true}
          animateDice={isDiceAnimated && !isDiceAlreadyUsed}
        />
      );
    }

    diceArray.push(dice);
  }

  return (
    <div className="grid w-full h-64 max-w-sm grid-cols-3 px-12 py-6 select-none gap-x-5 gap-y-2">
      {diceArray}
    </div>
  );
}

const diceRotation = [
  "transform rotate-3",
  "transform rotate-2",
  "transform -rotate-6",
  "transform -rotate-3",
  "transform -rotate-6",
  "transform rotate-2",
];
