import React, { ReactElement } from "react";
import numeral from "numeral";
import SectionLabel from "../../text/sectionLabel";
import { Player } from "../../../utils/interfaces";

interface Props {
  data: Player[];
  activeUser: string;
}

export default function index({ data, activeUser }: Props): ReactElement {
  return (
    <div className="w-full">
      <SectionLabel text="Scoreboard" />
      <div className="grid w-full h-32 grid-cols-2 gap-2 px-8">
        {data.map((person, i) => {
          return (
            <Person
              data={person}
              activeUser={person.code === activeUser}
              key={person.code ? person.code : i}
            />
          );
        })}
      </div>
    </div>
  );
}

interface PersonProps {
  data: Player;
  activeUser: boolean;
}

const Person = ({ data, activeUser }: PersonProps) => {
  return (
    <div className="relative w-full">
      {data.code && activeUser ? (
        <p className="relative z-20 h-6 overflow-hidden font-bold text-yellow-200 truncate text-shadow">
          {numeral(data.banked_score).format("#,#")}: {data.name}{" "}
          {data.host ? "(H)" : ""}
        </p>
      ) : null}

      {data.code && !activeUser ? (
        <p className="relative z-20 h-6 overflow-hidden text-white truncate text-shadow">
          {numeral(data.banked_score).format("#,#")}: {data.name}
        </p>
      ) : null}

      {!data.code ? (
        <p className="relative z-20 h-6 overflow-hidden text-white truncate text-shadow"></p>
      ) : null}

      {activeUser ? (
        <>
          <div className="absolute top-0 z-10 w-16 h-6 transform bg-red-600 rounded-sm -left-2 -rotate-3"></div>
        </>
      ) : null}
    </div>
  );
};
