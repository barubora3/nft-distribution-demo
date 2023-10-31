"use client";
import Image from "next/image";
import { useState } from "react";

import Regist from "./components/Regist";
import Records from "./components/Records";
import Mint from "./components/Mint";
import Loading from "./components/Loading";

export interface HomeProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Home() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {isLoading && <Loading />}
      <Regist setIsLoading={setIsLoading} />
      <Mint setIsLoading={setIsLoading} />
      <Records setIsLoading={setIsLoading} />
    </main>
  );
}
