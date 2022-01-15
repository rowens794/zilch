import React, { ReactElement, useState } from "react";

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

  //ensure the provided code is accurate or let user know it is not
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

  //function to add a new user to a game
  const joinGame = async () => {
    if (name.length >= 1) {
      if (name !== "") {
        const response = await fetch("/api/joinGame/addToGame", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameID: code, name }),
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

  //control input into game code input box
  const inputGameCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value;

    //remove any preexisting error messages
    setErr("");

    //update the game code (max strlen of 3)
    if (value.length <= 3) {
      setCode(e.target.value.toUpperCase());
    }
  };

  //control input into name input box
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
    <div className="relative flex justify-center w-full h-full bg-red-700">
      <div className="mt-24 text-center">
        <p className="w-full m-auto text-2xl font-bold text-center text-white text-shadow-md ">
          Join a
        </p>
        <p className="w-full m-auto font-extrabold text-center text-white text-7xl text-shadow-lg">
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
            <div className="inline-block w-4 h-4 bg-yellow-300 rounded-full drop-shadow-harshDkRed" />
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block w-4 h-4 bg-white rounded-full drop-shadow-harshDkRed" />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="w-full m-auto mt-6 text-center">
      <div className="relative inline-block">
        <div className="relative grid w-20 grid-cols-2 text-center">
          <Bubble active={step >= 1} />
          <Bubble active={step === 2} />
        </div>
      </div>
    </div>
  );
};
