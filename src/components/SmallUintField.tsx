"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import Button from "./Button";
import InputField from "./InputField";

const contractAddress = "0xF526C4fB3A22f208058163A34278989D1f953619";
const contractABI = [
  "function setSmallUint(uint8 _smallUint) public",
  "function smallUint() public view returns (uint8)",
];

const SmallUintField = () => {
  const { address } = useAccount();
  const [smallUint, setSmallUint] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSmallUint = async () => {
    if (!address) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const value = await contract.smallUint();
      setSmallUint(Number(value));
    } catch (error) {
      console.error("Ошибка при получении smallUint:", error);
    }
  };

  const handleSubmit = async () => {
    if (!address) {
      alert("Подключите кошелек, чтобы отправить данные.");
      return;
    }

    const parsedValue = parseInt(inputValue, 10);
    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 255) {
      alert("Введите число от 0 до 255");
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

      const tx = await contract.setSmallUint(parsedValue);
      await tx.wait();

      await fetchSmallUint();
    } catch (error) {
      console.error("Ошибка при отправке транзакции:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchSmallUint();
    }
  }, [address]);

  return (
    <div className="bg-white p-4 rounded shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Текущее значение smallUint:</h2>
      <InputField
        label="Текущее значение"
        value={smallUint ?? "Загрузка..."}
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

export default SmallUintField;
