import { useState } from "react";
import { HomeProps } from "../page";

export default function Regist({ setIsLoading }: HomeProps) {
  const [address, setAddress] = useState("");

  const evmAddressPattern = /^0x[a-fA-F0-9]{40}$/;

  const addRecord = async () => {
    if (evmAddressPattern.test(address) === false) {
      alert("Invalid EVM address");
      return;
    }
    setIsLoading(true);
    const response = await fetch("/api/add", {
      body: JSON.stringify({ address }),
      method: "POST",
    });
    const data = await response.json();
    console.log(data);
    setIsLoading(false);
  };
  return (
    <div>
      <div>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter an wallet address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
      </div>
      <div className="flex justify-center pt-4 pb-2 ">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={addRecord}
        >
          add record
        </button>
      </div>
    </div>
  );
}
