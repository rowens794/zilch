import React, { ReactElement, useState } from "react";
import { CheckIcon } from "@heroicons/react/solid";

import PrimaryInput from "../../components/inputs/primary-input";
import PrimaryAction from "../../components/buttons/primary-action";
import BackButton from "../../components/buttons/back-button";
import ErrorMsg from "../../components/text/errMsg";

interface Props {}

export default function Index({}: Props): ReactElement {
  let [name, setName] = useState("");
  let [err, setErr] = useState("");
  let [step, setStep] = useState(1);
  let [code, setCode] = useState("");

  const checkGameCode = async () => {
    setErr("");

    if (code.length === 3) {
      const response = await fetch("/api/joinGame/checkGameExists", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameID: code }), // body data type must match "Content-Type" header
      });

      let res = await response.json();
      if (res.gameStatus) {
        setStep(2);
      } else {
        setErr("That game does not exist or has already started");
      }
    } else {
      setErr("Enter a valid code");
    }
  };

  const joinGame = async () => {
    if (name.length >= 1) {
      if (name !== "") {
        const response = await fetch("/api/joinGame/addToGame", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameID: code, name }), // body data type must match "Content-Type" header
        });

        let res = await response.json();

        //ensure that the response was successful and forward to game lobby
        if (res.gameID && res.userID) {
          window.location.href = `/lobby/${res.gameID}/${res.userID}`;
        } else {
          setErr("There was a problem adding you to the game");
        }
      }
    } else {
      setErr("Enter your name");
    }
  };

  const inputGameCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value;

    //remove any preexisting error messages
    setErr("");

    //update the game code (max strlen of 6)
    if (value.length <= 6) {
      setCode(e.target.value.toUpperCase());
    }
  };

  const inputName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value;

    //remove any preexisting error messages
    setErr("");

    //update the game code (max strlen of 6)
    if (value.length <= 10) {
      setName(e.target.value.toUpperCase());
    } else {
      setErr("Whoa! Keep it short bro.");
    }
  };

  return (
    <div className="bg-red-700 w-full h-screen relative flex justify-center">
      <div className="text-center mt-24">
        <p className="text-2xl text-shadow-md font-bold text-white m-auto w-full text-center ">
          Join a
        </p>
        <p className="text-7xl font-extrabold text-shadow-lg text-white m-auto w-full text-center">
          ZILCH!
        </p>

        <div className="mt-24">
          {step === 1 ? (
            <PrimaryInput
              label="Enter Game Code"
              placeholder="Ask the host"
              value={code}
              action={inputGameCode}
              id="game-id"
            />
          ) : (
            <PrimaryInput
              id="name"
              label="Say Your Name!"
              placeholder="Say it here"
              value={name}
              action={inputName}
            />
          )}

          {step === 1 ? (
            <PrimaryAction label="Find Game!" action={checkGameCode} />
          ) : (
            <PrimaryAction label="Join Game!" action={joinGame} />
          )}
        </div>

        <Progress step={step} />
        {err !== "" ? <ErrorMsg msg={err} /> : null}
      </div>

      <div className="absolute bottom-12 left-8">
        <BackButton href="/" />
      </div>
    </div>
  );
}

interface ProgressProps {
  step: number;
}

const Progress = ({ step }: ProgressProps) => {
  interface BubbleProps {
    active: boolean;
  }

  const Bubble = ({ active }: BubbleProps) => {
    return (
      <>
        {active ? (
          <div className="text-center">
            <div className="bg-yellow-300 rounded-full w-4 h-4 inline-block drop-shadow-harshDkRed" />
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-white rounded-full w-4 h-4 inline-block drop-shadow-harshDkRed" />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="m-auto mt-6 w-full text-center">
      <div className="relative inline-block">
        <div className="relative grid grid-cols-2 w-20 text-center">
          <Bubble active={step >= 1} />
          <Bubble active={step === 2} />
        </div>
      </div>
    </div>
  );
};
