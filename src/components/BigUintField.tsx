"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const contractAddress = "0xF526C4fB3A22f208058163A34278989D1f953619";
const contractABI = [
  "function bigUint() public view returns (uint256)",
  "function setBiglUint(uint256 _bigUint) public",
];

const BigUintField = () => {
  const { address } = useAccount(); // Текущий аккаунт
  const [bigUint, setBigUint] = useState<bigint | null>(null);
  const [inputValue, setInputValue] = useState<string>(""); // Для нового значения
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Получение текущего значения bigUint из контракта
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

  // Отправка нового значения в контракт
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

      console.log("Отправка транзакции...");
      const tx = await contract.setBiglUint(parsedValue);
      console.log("Транзакция отправлена:", tx);

      const receipt = await tx.wait();
      console.log("Транзакция подтверждена:", receipt);

      await fetchBigUint(); // Обновление значения после успешной транзакции
    } catch (error) {
      console.error("Ошибка при отправке транзакции:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка значения bigUint при подключении кошелька
  useEffect(() => {
    if (address) {
      fetchBigUint();
    }
  }, [address]);

  return (
    <div className="container">
      <h2>
        Текущее значение bigUint:{" "}
        {bigUint !== null ? bigUint.toString() : "Загрузка..."}
      </h2>
      <div>
        <input
          type="number"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Отправка..." : "Отправить новое значение"}
        </button>
      </div>
    </div>
  );
};

export default BigUintField;
