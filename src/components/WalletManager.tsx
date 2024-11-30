"use client";

import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";

export default function WalletManager() {
  const { address, isConnected } = useAccount(); // Получение данных о подключении
  const { disconnect } = useDisconnect(); // Отключение кошелька
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  // Инициализация из localStorage
  useEffect(() => {
    const accountFromLocalStorage = localStorage.getItem("account");
    if (accountFromLocalStorage) {
      setCurrentAccount(accountFromLocalStorage);
    }
  }, []);

  // Сохранение аккаунта при подключении
  useEffect(() => {
    if (isConnected && address) {
      localStorage.setItem("account", address);
      setCurrentAccount(address);
    }
  }, [isConnected, address]);

  const handleDisconnect = () => {
    disconnect(); // Отключение через wagmi
    localStorage.removeItem("account");
    setCurrentAccount(null);
  };

  return (
    <div>
      {!currentAccount && <p>Кошелек не подключен</p>}
      {currentAccount && (
        <div>
          <p>Активный аккаунт: {currentAccount}</p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleDisconnect}
          >
            Отключить кошелек
          </button>
        </div>
      )}
    </div>
  );
}
