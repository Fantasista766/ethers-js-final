"use client";

import { useState, useEffect } from "react";
import { ethers, formatEther } from "ethers";
import { useAccount } from "wagmi";

export default function WalletBalance() {
  const { chain, address, isConnected } = useAccount();
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && address && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(
            window.ethereum as ethers.Eip1193Provider
          );
          const balance = await provider.getBalance(address);
          setBalance(formatEther(balance));
        } catch (error) {
          console.error("Ошибка при получении баланса:", error);
        }
      }
    };

    fetchBalance();
  }, [isConnected, address, chain?.id]);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      {isConnected && address && (
        <p className="text-gray-700">
          Баланс:{" "}
          <span className="font-bold">{balance || "Загрузка..."} ETH</span>
        </p>
      )}
    </div>
  );
}
