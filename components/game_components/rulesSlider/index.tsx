import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EyeOffIcon } from "@heroicons/react/solid";

interface Props {
  open: boolean;
  setOpen: Function;
}
export default function Example({ open, setOpen }: Props) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-30 overflow-hidden"
        onClose={() => setOpen()}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative z-30 w-screen ">
                <div className="flex flex-col h-full py-6 overflow-y-scroll bg-red-800 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-xl font-bold text-white">
                        Rules
                      </Dialog.Title>
                      <div className="flex items-center ml-3 h-7">
                        <button type="button" onClick={() => setOpen(false)}>
                          <EyeOffIcon className="absolute w-8 h-8 text-red-400 top-2 right-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 px-4 mt-6 sm:px-6">
                    {/* Replace with your content */}
                    <div className="absolute inset-0 px-4 sm:px-6">
                      <Rules />
                      <ScoringRolls />
                    </div>
                    {/* /End replace */}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const Rules = () => {
  return (
    <div>
      <ul className="ml-4 text-sm text-white list-disc">
        <li>You must roll scoring dice each on each roll</li>
        <li>You must bank 750 points to leave pergatory</li>
        <li>
          If you use all six dice, you can re-roll all of the dice on your same
          turn
        </li>
        <li>
          Once a player scores 10,000 points the final roll will be triggered
        </li>
        <li>The player with the highest score wins</li>
      </ul>
    </div>
  );
};

const ScoringRolls = () => {
  return (
    <div>
      <p className="mt-4 text-lg font-bold text-white underline">
        Scoring Rolls
      </p>
      <ul className="pb-16 ml-4 text-sm text-white list-disc">
        <li>Gargantuan (6x any) = 5,000</li>
        <li>Straight 1-6 = 2,500</li>
        <li>2 sets of 3 - 2,000 pts</li>
        <li>3 sets of 2 - 1,500 pts</li>
        <li>3x 1s - 1,000 pts</li>
        <li>3x 2s - 200 pts</li>
        <li>3x 3s - 300 pts</li>
        <li>3x 4s - 400 pts</li>
        <li>3x 5s - 500 pts</li>
        <li>3x 6s - 600 pts</li>
        <li>1 - 100 pts</li>
        <li>5 - 50 pts</li>
      </ul>
    </div>
  );
};
