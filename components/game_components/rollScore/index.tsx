import React, { ReactElement } from "react";
import numeral from "numeral";
import SectionLabel from "../../text/sectionLabel";
import { Player } from "../../../utils/interfaces";

interface Props {
  turnScore: number;
  rollScore: number;
  gameStage: number;
  validSelection: boolean;
}

export default function index({
  turnScore,
  rollScore,
  gameStage,
  validSelection,
}: Props): ReactElement {
  return (
    <div className="w-full">
      <div className="w-full px-4 my-4 ">
        <p className="text-xl font-bold text-center text-white text-shadow">
          Turn Score = {numeral(turnScore).format("#,#")}
        </p>

        {gameStage ? (
          <p className="font-bold text-center text-white text-shadow">
            Roll Score = {numeral(rollScore).format("#,#")}
          </p>
        ) : null}

        {gameStage === 3 && !validSelection ? (
          <p className="mt-2 italic font-light text-center text-yellow-200 text-shadow">
            Invalid combination
          </p>
        ) : null}
      </div>
    </div>
  );
}
