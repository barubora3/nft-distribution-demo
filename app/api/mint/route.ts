import { NextResponse } from "next/server";
import { db } from "@vercel/postgres";

import { ThirdwebSDK } from "@thirdweb-dev/sdk";
const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY!, "mumbai", {
  clientId: process.env.THIRDWEB_CLIENT_ID!,
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

export async function GET() {
  // txHashがnull（=Mintトランザクション未実行）のレコードを抽出
  console.log("Mint関数スタート");
  const client = await db.connect();
  const result = await client.query(
    `SELECT * FROM Users WHERE txHash IS NULL ORDER BY created_at;`
  );
  const recordsToBeUpdated = result.rows;

  console.log("未ミントレコード:" + result.rows.length);

  // コントラクト
  const contract = await sdk.getContract(process.env.CONTRACT_ADDRESS!);

  // 現在時刻
  const currentTime = new Date().toISOString();

  // 1トランザクションで複数のmintを実行するため、txListにmintトランザクションの情報を詰める
  let txList = [];
  for (const record of recordsToBeUpdated) {
    // テスト用にmetadataを用意するのが面倒なのでuriは適当な文字列にしている
    const tx = await contract.erc721.mintTo.prepare(record.address, "hogehoge");
    txList.push(tx);
  }

  // txListをエンコード
  const encodedTransactions = txList.map((tx) => tx.encode());

  // multicallでまとめて実行
  console.log("Tx実行開始");
  const res = await contract.call("multicall", [encodedTransactions]);
  console.log("Tx実行終了");
  // txHashを取得
  const txHash = res.receipt.transactionHash;

  // 今回Mintを実行したレコードのtxHashと実行時刻を更新
  for (const record of recordsToBeUpdated) {
    await await client.query(
      `UPDATE Users SET txHash = '${txHash}', executed_at = '${currentTime}' WHERE user_id = ${record.user_id};`
    );
  }
  console.log("Mint関数終了");
  return NextResponse.json({});
}
