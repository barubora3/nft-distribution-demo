export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { HomeProps } from "../page";

interface Record {
  address: string;
  created_at: string;
  txHash?: string;
  executed_at?: string;
}

export default function Records({ setIsLoading }: HomeProps) {
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    getRecords();
  }, []);

  const getRecords = async () => {
    setIsLoading(true);
    const response = await fetch("/api/get", {
      method: "GET",
      cache: "no-store",
    });
    const data = await response.json();
    console.log(data.records);
    setRecords(data.records);
    setIsLoading(false);
  };
  return (
    <div>
      <div className="flex justify-center py-2">
        <button
          className="bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded"
          onClick={getRecords}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M1.903 7.297c0 3.044 2.207 5.118 4.686 5.547a.521.521 0 1 1-.178 1.027C3.5 13.367.861 10.913.861 7.297c0-1.537.699-2.745 1.515-3.663c.585-.658 1.254-1.193 1.792-1.602H2.532a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V2.686l-.001.002c-.572.43-1.27.957-1.875 1.638c-.715.804-1.253 1.776-1.253 2.97Zm11.108.406c0-3.012-2.16-5.073-4.607-5.533a.521.521 0 1 1 .192-1.024c2.874.54 5.457 2.98 5.457 6.557c0 1.537-.699 2.744-1.515 3.663c-.585.658-1.254 1.193-1.792 1.602h1.636a.5.5 0 1 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 1 1 1 0v1.845h.002c.571-.432 1.27-.958 1.874-1.64c.715-.803 1.253-1.775 1.253-2.97Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {records.length > 0 && (
        <table className="text-sm m-4">
          <thead>
            <tr>
              <th className="px-2 py-1 ">address</th>
              <th className="px-2 py-1">created_at</th>
              <th className="px-2 py-1">txHash</th>
              <th className="px-2 py-1">executed_at</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td className="px-2 py-1">{record.address}</td>
                <td className="px-2 py-1">{record.created_at}</td>
                <td className="px-2 py-1 truncate  hover:underline">
                  <a
                    href={`https://mumbai.polygonscan.com/tx/${record.txHash}`}
                    target="_blank"
                  >
                    {record.txHash}
                  </a>
                </td>
                <td className="px-2 py-1">{record.executed_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
