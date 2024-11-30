"use client";

import { useState, useEffect } from "react";
import { ethers, BrowserProvider, formatEther } from "ethers";
import { useAccount } from "wagmi";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

export default function WalletBalance() {
  const { chain, address, isConnected } = useAccount(); // Текущий аккаунт
  const [balance, setBalance] = useState<string>(""); // Баланс в ETH

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && address && window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(address);
          setBalance(formatEther(balance));
        } catch (error) {
          console.error("Ошибка при получении баланса:", error);
        }
      }
    };

    fetchBalance();
  }, [isConnected, address, chain?.id]); // Добавляем `chain?.id` как зависимость для обновления при смене сети

  return (
    <div>
      {isConnected && address && (
        <>
          <p>Баланс: {balance || "Загрузка..."} ETH</p>
        </>
      )}
    </div>
  );
}
