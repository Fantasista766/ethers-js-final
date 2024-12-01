"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import Button from "./Button";
import InputField from "./InputField";

const contractAddress = "0xF526C4fB3A22f208058163A34278989D1f953619";
const contractABI = [
  "function bigUint() public view returns (uint256)",
  "function setBiglUint(uint256 _bigUint) public",
];

const BigUintField = () => {
  const { address } = useAccount();
  const [bigUint, setBigUint] = useState<bigint | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBigUint = async () => {
    if (!address) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const value = await contract.bigUint();
      setBigUint(BigInt(value));
    } catch (error) {
      console.error("Ошибка при получении bigUint:", error);
    }
  };

  const handleSubmit = async () => {
    if (!address) {
      alert("Подключите кошелек, чтобы отправить данные.");
      return;
    }

    const parsedValue = BigInt(inputValue);
    if (parsedValue < 0) {
      alert("Введите положительное число.");
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

      const tx = await contract.setBiglUint(parsedValue);
      await tx.wait();

      await fetchBigUint();
    } catch (error) {
      console.error("Ошибка при отправке транзакции:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchBigUint();
    }
  }, [address]);

  return (
    <div className="bg-white p-4 rounded shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Текущее значение bigUint:</h2>
      <InputField
        label="Текущее значение"
        value={bigUint?.toString() ?? "Загрузка..."}
        disabled
      />
      <InputField
        label="Новое значение"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        type="number"
      />
      <Button onClick={handleSubmit} isLoading={isLoading}>
        Отправить новое значение
      </Button>
    </div>
  );
};

export default BigUintField;
