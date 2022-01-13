import React, { ReactElement, useState, useEffect } from "react";
import styles from "./dice.module.css";

interface Props {
  diceNumber: number;
  diceValues: number[];
  diceSelections: boolean[];
  startOfTurn: boolean;
  setDiceSelections: Function;
  diceRotation: string;
  deadDice: boolean;
  animateDice: boolean;
}

export default function Index({
  diceNumber, //the index of the dice in the array (to set selected)
  diceValues, //the final number all dice are to display
  diceRotation, //sets the css for dice placement
  diceSelections, // array holding whether dice is selected
  // startOfTurn, //keeps track of whether it is the start of a players turn (prevents auto-rolling)
  setDiceSelections, //function to change selected dice
  deadDice, //determines whether the dice is live or not
  animateDice,
}: Props): ReactElement {
  let [num, setNum] = useState(1);
  let [intervalID, setIntervalID] = useState<NodeJS.Timer | null>(null);

  useEffect(() => {
    let SPEED = 100; //ms

    if (animateDice && !intervalID) {
      // runs dice animation for a period of time set by timeToRun
      // at a speed in ms set by SPEED
      let intervalID = setInterval(() => {
        let roll = randomIntFromInterval(1, 6);
        setNum(roll);
      }, SPEED);

      setIntervalID(intervalID);
    }

    if (intervalID && !animateDice) {
      clearInterval(intervalID);
      setIntervalID(null);
      setNum(diceValues[diceNumber]);
    }
  }, [animateDice, setNum, intervalID, diceValues, diceNumber]);

  useEffect(() => {
    //resets numbers on page load (without animation)
    setNum(diceValues[diceNumber]);
  }, [diceValues, diceNumber]);

  return (
    <>
      {!deadDice ? (
        <LiveDice
          diceSelections={diceSelections}
          diceNumber={diceNumber}
          diceRotation={diceRotation}
          num={num}
          setDiceSelections={setDiceSelections}
        />
      ) : (
        <DeadDice
          diceSelections={diceSelections}
          diceNumber={diceNumber}
          diceRotation={diceRotation}
          num={num}
          setDiceSelections={setDiceSelections}
        />
      )}
    </>
  );
}

interface DiceProps {
  diceSelections: Boolean[];
  diceNumber: number;
  diceRotation: string;
  num: number;
  setDiceSelections: Function;
}

const LiveDice = ({
  diceSelections,
  diceNumber,
  diceRotation,
  setDiceSelections,
  num,
}: DiceProps) => {
  const selectDice = () => {
    let adjustedSelections = [...diceSelections];
    adjustedSelections[diceNumber] = !adjustedSelections[diceNumber];
    setDiceSelections(adjustedSelections);
  };

  return (
    <>
      {diceSelections[diceNumber] ? (
        <div
          className={` w-16 h-16 bg-white rounded-md border-2 border-yellow-300 m-auto drop-shadow-harshYellow ${diceRotation} select-none `}
        >
          <p
            className="w-full m-auto text-6xl text-center text-gray-700 cursor-pointer"
            onClick={selectDice}
          >
            {num}
          </p>
        </div>
      ) : (
        <div
          className={`w-16 h-16 bg-white rounded-md border border-gray-900 m-auto drop-shadow-harshDkRed ${diceRotation} select-none`}
        >
          <p
            className="w-full m-auto text-6xl text-center text-gray-700 cursor-pointer"
            onClick={selectDice}
          >
            {num}
          </p>
        </div>
      )}
    </>
  );
};

const DeadDice = ({ diceRotation, num }: DiceProps) => {
  return (
    <>
      <div
        className={` w-16 h-16 bg-gray-400 rounded-md border border-gray-800 m-auto drop-shadow-harshDkRed ${diceRotation} select-none`}
      >
        <p className="w-full m-auto text-6xl text-center text-gray-700 cursor-pointer">
          {num}
        </p>
      </div>
    </>
  );
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
