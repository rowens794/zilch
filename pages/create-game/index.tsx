import React, { ReactElement, useState } from "react";

import PrimaryInput from "../../components/inputs/primary-input";
import PrimaryAction from "../../components/buttons/primary-action";
import BackButton from "../../components/buttons/back-button";
import ErrorMsg from "../../components/text/errMsg";

interface Props {}

export default function Index({}: Props): ReactElement {
  let [name, setName] = useState("");
  let [err, setErr] = useState("");

  const inputName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value;
    if (value.length <= 6) {
      setName(e.target.value.toUpperCase());
    }
  };

  const createGame = async () => {
    if (name !== "") {
      fetch("/api/createGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          window.location.href = `/lobby/${res.gameID}/${res.userID}`;
        });
    } else {
      setErr("Say your name!");
    }
  };

  return (
    <div className="relative flex justify-center w-full h-full bg-red-700">
      <div className="mt-24 text-center">
        <p className="w-full m-auto text-2xl font-bold text-center text-white text-shadow-md ">
          Start a
        </p>
        <p className="w-full m-auto font-extrabold text-center text-white text-7xl text-shadow-lg">
          ZILCH!
        </p>

        <div className="mt-24">
          <PrimaryInput
            label="Say Your Name!"
            placeholder="Say it here"
            action={inputName}
            value={name}
            id="name"
          />

          <PrimaryAction label="Start Game!" action={createGame} />
        </div>

        {err !== "" ? <ErrorMsg msg={err} /> : null}
      </div>

      <div className="absolute bottom-12 left-8">
        <BackButton href="/" />
      </div>
    </div>
  );
}
