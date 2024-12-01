"use client";

import { useAccount, useSwitchChain } from "wagmi";
import Button from "./Button";

export default function SwitchNetwork() {
  const { chain } = useAccount(); // Текущая сеть
  const { switchChain, isPending, error } = useSwitchChain(); // Функция для переключения сети

  const handleSwitch = () => {
    if (switchChain) {
      switchChain({ chainId: 11155111 }); // Chain ID сети Sepolia
    } else {
      console.error("Переключение сети не поддерживается.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <p className="text-gray-700">
        Текущая сеть:{" "}
        <span className="font-bold">{chain?.name || "Не подключено"}</span>
      </p>
      <Button
        onClick={handleSwitch}
        disabled={isPending || chain?.id === 11155111}
        isLoading={isPending}
      >
        Переключиться на Sepolia
      </Button>
      {error && <p className="text-red-500 mt-2">Ошибка: {error.message}</p>}
    </div>
  );
}
