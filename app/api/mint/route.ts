import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { ThirdwebSDK } from "@thirdweb-dev/sdk";
const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PRIVATE_KEY!,
  // "mumbai",
  "https://polygon-mumbai-bor.publicnode.com",
  {
    clientId: process.env.THIRDWEB_CLIENT_ID!,
    secretKey: process.env.THIRDWEB_SECRET_KEY!,
  }
);
const provider = sdk.getProvider();

export const revalidate = 0;

export async function GET() {
  // txHashがnull（=Mintトランザクション未実行）のレコードを抽出
  console.log("Mint関数スタート");
  const targetRequests = await prisma.request.findMany({
    where: {
      txHash: {
        equals: null,
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });

  console.log("未ミントレコード:" + targetRequests.length);

  const transactionCount = await provider.getTransactionCount(
    await sdk.wallet.getAddress(),
    "latest"
  );
  // console.log(transactionCount);
  // const nonce = await sdk.wallet.getNonce();
  // console.log("nonce:" + nonce);
  // コントラクト
  const contract = await sdk.getContract(process.env.CONTRACT_ADDRESS!);

  // 現在時刻
  const currentTime = new Date().toISOString();

  // 1トランザクションで複数のmintを実行するため、txListにmintトランザクションの情報を詰める
  let txList = [];
  for (const request of targetRequests) {
    // テスト用にmetadataを用意するのが面倒なのでuriは適当な文字列にしている
    const tx = await contract.erc721.mintTo.prepare(
      request.address,
      "hogehoge"
    );
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
  for (const request of targetRequests) {
    const updatedRequest = await prisma.request.update({
      where: {
        id: request.id,
      },
      data: {
        txHash: txHash,
        executed_at: currentTime,
      },
    });
  }
  console.log("Mint関数終了");
  return NextResponse.json(
    { mintNum: targetRequests.length, txHash },
    { status: 200 }
  );
}
