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
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }), // body data type must match "Content-Type" header
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
    <div className="bg-red-700 w-full h-screen relative flex justify-center">
      <div className="text-center mt-24">
        <p className="text-2xl text-shadow-md font-bold text-white m-auto w-full text-center ">
          Start a
        </p>
        <p className="text-7xl font-extrabold text-shadow-lg text-white m-auto w-full text-center">
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
