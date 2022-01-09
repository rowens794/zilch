import React, { ReactElement } from "react";
import numeral from "numeral";
import SectionLabel from "../../text/sectionLabel";

interface Person {
  name?: string | null;
  score?: number | null;
  host?: boolean | null;
  code?: string | null;
}

interface Props {
  data: Person[];
  activeUser: string;
}

export default function index({ data, activeUser }: Props): ReactElement {
  return (
    <div className="w-full">
      <SectionLabel text="Scoreboard" />
      <div className="w-full px-8 grid grid-cols-2 gap-2">
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
  data: Person;
  activeUser: boolean;
}

const Person = ({ data, activeUser }: PersonProps) => {
  return (
    <div className="w-full relative">
      {data.code && activeUser ? (
        <p className=" text-yellow-200 font-bold text-shadow truncate overflow-hidden h-6 z-20 relative">
          {numeral(data.score).format("#,#")}: {data.name}{" "}
          {data.host ? "(H)" : ""}
        </p>
      ) : null}

      {data.code && !activeUser ? (
        <p className=" text-white text-shadow truncate overflow-hidden h-6 z-20 relative">
          {numeral(data.score).format("#,#")}: {data.name}
        </p>
      ) : null}

      {!data.code ? (
        <p className=" text-white text-shadow truncate overflow-hidden h-6 z-20 relative"></p>
      ) : null}

      {activeUser ? (
        <>
          <div className="absolute -top-1 -left-2 rounded-full bg-red-600 w-6 h-6 z-10 "></div>
        </>
      ) : null}
    </div>
  );
};
