import { ethers } from "ethers";
import contractABI from "@/contractABI.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";

export async function getContract() {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
  return contract;
}

export async function logFraudOnChain(
  transactionId: string,
  verdict: string,
  riskScore: number,
): Promise<string> {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const wallet = new ethers.Wallet(
    process.env.NEXT_PUBLIC_PRIVATE_KEY!,
    provider,
  );
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);
  const tx = await contract.logFraud(transactionId, verdict, riskScore);
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function getAuditRecords() {
  const contract = await getContract();
  const total = await contract.getTotalRecords();
  const records = [];

  for (let i = 0; i < Number(total); i++) {
    const record = await contract.getRecord(i);
    records.push({
      transactionId: record[0],
      verdict: record[1],
      riskScore: Number(record[2]),
      timestamp: Number(record[3]),
      reportedBy: record[4],
    });
  }

  return records;
}
