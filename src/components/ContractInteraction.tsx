"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const contractAddress = "0xF526C4fB3A22f208058163A34278989D1f953619";
const contractABI = [
  "function isTrue() public view returns (bool)",
  "function setTrue(bool _isTrue) public",
];

const ContractInteraction = () => {
  const { address } = useAccount();
  const [isTrue, setIsTrue] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchContractState();
  }, [address]);

  const fetchContractState = async () => {
    if (!address) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const value = await contract.isTrue();
      setIsTrue(value);
    } catch (error) {
      console.error("Ошибка при чтении контракта:", error);
    }
  };

  const handleSetTrue = async (newValue: boolean) => {
    if (!address) {
      alert("Подключите кошелек.");
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const tx = await contract.setTrue(newValue);
      console.log("Транзакция отправлена:", tx);

      await tx.wait();
      console.log("Транзакция подтверждена");

      fetchContractState();
    } catch (error) {
      console.error("Ошибка при отправке транзакции:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">
        Взаимодействие с контрактом
      </h2>
      <p className="text-gray-600">
        Текущее состояние:{" "}
        <span className="font-bold">{isTrue ? "Истина" : "Ложь"}</span>
      </p>
      <div className="flex gap-4">
        <button
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={() => handleSetTrue(true)}
          disabled={isLoading}
        >
          Установить Истину
        </button>
        <button
          className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          onClick={() => handleSetTrue(false)}
          disabled={isLoading}
        >
          Установить Ложь
        </button>
      </div>
    </div>
  );
};

export default ContractInteraction;
