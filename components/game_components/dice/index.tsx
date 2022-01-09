import React, { ReactElement, useState, useEffect } from "react";

interface Props {
  diceNumber: number;
  diceValues: number[];
  diceSelections: boolean[];
  startOfTurn: boolean;
  setDiceSelections: Function;
  diceRotation: string;
  deadDice: boolean;
}

export default function Index({
  diceNumber, //the index of the dice in the array (to set selected)
  diceValues, //the final number all dice are to display
  diceRotation, //sets the css for dice placement
  diceSelections, // array holding whether dice is selected
  startOfTurn, //keeps track of whether it is the start of a players turn (prevents auto-rolling)
  setDiceSelections, //function to change selected dice
  deadDice, //determines whether the dice is live or not
}: Props): ReactElement {
  let [num, setNum] = useState(1);

  useEffect(() => {
    let SPEED = 100; //ms
    let timeToRun = 1500; //
    let counter = 0;

    if (!startOfTurn && !deadDice) {
      // runs dice animation for a period of time set by timeToRun
      // at a speed in ms set by SPEED
      let intervalID = setInterval(() => {
        let roll = randomIntFromInterval(1, 6);
        counter += SPEED;
        setNum(roll);

        //once the counter reaches the timeToRun clear the interval and set the true value
        if (counter > timeToRun) {
          clearInterval(intervalID);
          setNum(diceValues[diceNumber]);
        }
      }, SPEED);
    }
  }, [diceValues, diceNumber, startOfTurn, setNum, deadDice]);

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
        <DeadDice diceRotation={diceRotation} num={num} />
      )}
    </>
  );
}

interface LiveDiceProps {
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
}: LiveDiceProps) => {
  const selectDice = () => {
    let adjustedSelections = [...diceSelections];
    adjustedSelections[diceNumber] = !adjustedSelections[diceNumber];
    setDiceSelections(adjustedSelections);
  };

  return (
    <>
      {diceSelections[diceNumber] ? (
        <div
          className={` w-16 h-16 bg-white rounded-md border-2 border-yellow-300 m-auto drop-shadow-harshYellow ${diceRotation} select-none`}
        >
          <p
            className="text-6xl m-auto w-full text-center text-gray-700 cursor-pointer"
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
            className="text-6xl m-auto w-full text-center text-gray-700 cursor-pointer"
            onClick={selectDice}
          >
            {num}
          </p>
        </div>
      )}
    </>
  );
};

interface DeadDiceProps {
  diceRotation: string;
  num: number;
}

const DeadDice = ({ num, diceRotation }: DeadDiceProps) => {
  return (
    <div
      className={` w-16 h-16 bg-gray-400 rounded-md border-2 border-gray-800 m-auto drop-shadow-harshDkRed ${diceRotation} select-none`}
    >
      <p className="text-6xl m-auto w-full text-center text-gray-700 cursor-pointer">
        {num}
      </p>
    </div>
  );
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
