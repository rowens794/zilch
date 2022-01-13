import React, { ReactElement } from "react";
import RollButton from "../../buttons/roll-button";
import BankButton from "../../buttons/bank-button";
import CollectButton from "../../buttons/collect-button";
import { Score } from "../../../utils/interfaces";

interface Props {
  gameStage: number;
  displayActions: boolean;
  score: Score;
  actionFunctions: {
    rollDice: () => void;
    takePoints: () => void;
    bankPoints: () => void;
  };
}

export default function Index({
  //game styling / stage management
  gameStage,
  displayActions,
  score,
  actionFunctions,
}: Props): ReactElement {
  return (
    <>
      {displayActions ? (
        <div>
          <div className="grid w-full grid-cols-2 px-4 my-4">
            {/* //stage 1 ------------------------------ // */}
            {gameStage === 1 ? (
              <BankButton
                label={`Take Points`}
                action={() => {}}
                active={false}
              />
            ) : null}

            {gameStage === 1 ? (
              <RollButton
                label="Roll"
                action={actionFunctions.rollDice}
                active={true}
              />
            ) : null}

            {/* //stage 2 ------------------------------ // */}

            {gameStage === 2 ? (
              <CollectButton
                label={`Take Points`}
                action={() => {}}
                active={false}
              />
            ) : null}

            {gameStage === 2 ? (
              <RollButton label="Roll" action={() => {}} active={false} />
            ) : null}

            {gameStage === 3 && score.validSelection && score.rollScore > 0 ? (
              <CollectButton
                label={`Take Points`}
                action={actionFunctions.takePoints}
                active={true}
              />
            ) : null}

            {gameStage === 3 ? (
              !score.validSelection || score.rollScore === 0 ? (
                <CollectButton
                  label={`Take Points`}
                  action={() => {}}
                  active={false}
                />
              ) : null
            ) : null}

            {gameStage === 3 ? (
              <RollButton
                label="Roll"
                action={actionFunctions.rollDice}
                active={false}
              />
            ) : null}

            {/* //stage 4 ------------------------------ // */}
            {gameStage === 4 ? (
              <BankButton
                label={`Bank Points`}
                action={actionFunctions.bankPoints}
                active={true}
              />
            ) : null}

            {gameStage === 4 ? (
              <RollButton
                label="Roll"
                action={actionFunctions.rollDice}
                active={true}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
