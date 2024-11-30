"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const contractAddress = "0xF526C4fB3A22f208058163A34278989D1f953619";
const contractABI = [
  "function setSmallUint(uint8 _smallUint) public",
  "function smallUint() public view returns (uint8)",
];

const EntranceField = () => {
  const { address } = useAccount(); // Текущий аккаунт

  const [smallUint, setSmallUint] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Получение текущего значения smallUint из контракта
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

  // Отправка нового значения в контракт
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

      console.log("Отправка транзакции...");
      const tx = await contract.setSmallUint(parsedValue);
      console.log("Транзакция отправлена:", tx);

      const receipt = await tx.wait();
      console.log("Транзакция подтверждена:", receipt);

      await fetchSmallUint(); // Обновление состояния после успешной транзакции
    } catch (error) {
      console.error("Ошибка при отправке транзакции:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка значения smallUint при подключении кошелька
  useEffect(() => {
    if (address) {
      fetchSmallUint();
    }
  }, [address]);

  return (
    <div className="container">
      <h2>
        Текущее значение smallUint:{" "}
        {smallUint !== null ? smallUint : "Загрузка..."}
      </h2>
      <div>
        <input
          type="number"
          min={0}
          max={255}
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

export default EntranceField;
