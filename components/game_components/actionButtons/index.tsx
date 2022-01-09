import React, { ReactElement } from "react";
import RollButton from "../../buttons/roll-button";
import BankButton from "../../buttons/bank-button";
import CollectButton from "../../buttons/collect-button";

interface Props {
  actionButtonObject: {
    stage: number;
    rollDice: Function;
    takePoints: Function;
    validSelection: boolean;
    currentPlayerName: string;
    activePlayerID: string;
    userID: string;
    bankPoints: Function;
    rollScore: number;
    turnScore: number;
  };
}

export default function Index({ actionButtonObject }: Props): ReactElement {
  let {
    stage,
    rollDice,
    takePoints,
    validSelection,
    currentPlayerName,
    activePlayerID,
    userID,
    rollScore,
    turnScore,
    bankPoints,
  } = actionButtonObject;

  return (
    <>
      {/* test to see if the active player is the logged it player */}
      {activePlayerID === userID ? (
        <div>
          <div className="grid-cols-2 w-full px-4 my-4 grid">
            {/* //stage 1 ------------------------------ // */}
            {stage === 1 ? (
              <BankButton
                label={`Bank Points`}
                action={() => console.log("roll")}
                active={false}
              />
            ) : null}

            {stage === 1 ? (
              <RollButton label="Roll" action={rollDice} active={true} />
            ) : null}

            {/* //stage 2 ------------------------------ // */}

            {stage === 2 ? (
              <CollectButton
                label={`Bank Points`}
                action={takePoints}
                active={false}
              />
            ) : null}

            {stage === 2 ? (
              <RollButton label="Roll" action={rollDice} active={false} />
            ) : null}

            {/* //stage 3 ------------------------------ // */}
            {stage === 3 && validSelection && rollScore > 0 ? (
              <CollectButton
                label={`Take Points`}
                action={takePoints}
                active={true}
              />
            ) : null}

            {/* This one's ugly but I'm checking if it's stage 3 and
        if either an invalid selection or a roll score of 0 */}
            {stage === 3 ? (
              !validSelection || rollScore === 0 ? (
                <CollectButton
                  label={`Take Points`}
                  action={() => {}}
                  active={false}
                />
              ) : null
            ) : null}

            {stage === 3 ? (
              <RollButton label="Roll" action={rollDice} active={false} />
            ) : null}

            {/* //stage 4 ------------------------------ // */}
            {stage === 4 ? (
              <BankButton
                label={`Bank Points`}
                action={bankPoints}
                active={true}
              />
            ) : null}

            {stage === 4 ? (
              <RollButton label="Roll" action={rollDice} active={true} />
            ) : null}
          </div>

          <div className="w-full px-4 my-4 ">
            <p className="text-xl text-center font-bold text-white text-shadow">
              Turn Score = {turnScore}
            </p>

            {stage === 3 ? (
              <p className="text-center font-bold text-white text-shadow">
                Roll Score = {rollScore}
              </p>
            ) : null}

            {stage === 3 && !validSelection ? (
              <p className="text-center text-yellow-200 font-light text-shadow mt-2 italic">
                Invalid combination
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div>
          <div className="w-full px-4 my-4">
            <p className=" bg-yellow-200 p-2 text-yellow-800 text-lg my-2 drop-shadow-harshDkRed tranform -rotate-2 font-extrabold mx-auto text-center w-full">
              {currentPlayerName} IS ROLLING
            </p>
          </div>
        </div>
      )}
    </>
  );
}
