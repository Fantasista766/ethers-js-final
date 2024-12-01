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
    <div className="bg-white p-4 rounded shadow">
      {!currentAccount && <p>Кошелек не подключен</p>}
      {currentAccount && (
        <div>
          <p className="text-sm break-words">
            Активный аккаунт:{" "}
            <span className="block text-blue-600 truncate">
              {currentAccount}
            </span>
          </p>
          <button
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            onClick={handleDisconnect}
          >
            Отключить кошелек
          </button>
        </div>
      )}
    </div>
  );
}
