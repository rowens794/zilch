import React, { ReactElement } from "react";
import Dice from "../dice";

interface Props {
  gameBoardObject: {
    diceSelections: boolean[];
    diceValues: number[];
    stage: number;
    startOfTurn: boolean;
    setDiceSelections: Function;
    usedDice: number[];
  };
}

export default function index({ gameBoardObject }: Props): ReactElement {
  let { diceSelections, setDiceSelections, startOfTurn, diceValues, usedDice } =
    gameBoardObject;

  let diceArray = [];
  for (let i = 0; i < 6; i++) {
    let dice = null;

    if (!usedDice[i]) {
      dice = (
        <Dice
          key={i}
          diceValues={diceValues}
          diceNumber={i}
          diceSelections={diceSelections}
          setDiceSelections={setDiceSelections}
          startOfTurn={startOfTurn}
          diceRotation={diceRotation[i]} // css to style each dice
          deadDice={startOfTurn ? true : false}
        />
      );
    } else {
      dice = (
        <Dice
          key={i}
          diceValues={diceValues}
          diceNumber={i}
          diceSelections={diceSelections}
          setDiceSelections={setDiceSelections}
          startOfTurn={startOfTurn}
          diceRotation={diceRotation[i]} // css to style each dice
          deadDice={true}
        />
      );
    }

    diceArray.push(dice);
  }
  return (
    <div className="w-full grid grid-cols-3 gap-x-5 gap-y-2 h-64 px-12 py-6 max-w-sm select-none">
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
