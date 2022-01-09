import React, { ReactElement } from "react";
import Link from "next/link";

interface Props {
  href: string;
  text: string;
}

export default function Index({ href, text }: Props): ReactElement {
  return (
    <Link href={href}>
      <a className="relative">
        <button className=" bg-white p-4 text-red-800 text-xl my-2 w-full drop-shadow-harshDkRed tranform -rotate-2 font-extrabold">
          {text}
        </button>
      </a>
    </Link>
  );
}
