import React, { ReactElement } from "react";
import RollButton from "../../buttons/roll-button";
import BankButton from "../../buttons/bank-button";
import CollectButton from "../../buttons/collect-button";
import { Score, GameData, Player } from "../../../utils/interfaces";

interface Props {
  gameStage: number;
  displayActions: boolean;
  score: Score;
  actionFunctions: {
    rollDice: () => void;
    takePoints: () => void;
    bankPoints: () => void;
  };
  gameData: GameData;
}

export default function Index({
  //game styling / stage management
  gameStage,
  displayActions,
  score,
  actionFunctions,
  gameData,
}: Props): ReactElement {
  const rollPergatory = inRollPergatory(gameData);
  return (
    <>
      {displayActions ? (
        <div>
          <div className="grid w-full grid-cols-2 px-4 my-2 xs:my-4">
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
              rollPergatory ? (
                <BankButton
                  label={`Pergatory`}
                  action={() => {}}
                  active={false}
                />
              ) : (
                <BankButton
                  label={`Bank Points`}
                  action={actionFunctions.bankPoints}
                  active={true}
                />
              )
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

const inRollPergatory = (gameData: GameData) => {
  let userID = gameData.activePlayer.userID;
  let player: Player = gameData.playerList.filter(
    (obj) => obj.code === userID
  )[0];

  if (player.banked_score < 750 && player.turn_score < 750) {
    return true;
  } else {
    return false;
  }
};
