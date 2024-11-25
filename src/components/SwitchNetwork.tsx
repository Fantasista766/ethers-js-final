"use client";

import { useAccount, useSwitchChain } from "wagmi";
import Button from "@mui/material/Button";

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
    <div>
      <p>Текущая сеть: {chain?.name || "Не подключено"}</p>
      <Button
        onClick={handleSwitch}
        disabled={isPending || chain?.id === 11155111}
      >
        {isPending ? "Переключение..." : "Переключиться на Sepolia"}
      </Button>
      {error && <p style={{ color: "red" }}>Ошибка: {error.message}</p>}
    </div>
  );
}
