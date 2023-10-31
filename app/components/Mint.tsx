import { useState } from "react";
import { HomeProps } from "../page";

export default function Mint({ setIsLoading }: HomeProps) {
  const mint = async () => {
    setIsLoading(true);
    const response = await fetch("/api/mint", {
      method: "GET",
    });

    const data = await response.json();
    console.log(data.records);
    setIsLoading(false);
  };
  return (
    <div className="py-2">
      <div className="">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={mint}
        >
          Mint
        </button>
      </div>
    </div>
  );
}
