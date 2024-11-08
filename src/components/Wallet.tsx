import { useState, useEffect } from "react";
import { BrowserProvider, Eip1193Provider, ethers, formatEther } from "ethers";

import SendTransaction from "../components/SendTransaction";

// если у вас Typescript
declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

const SEPOLIA_CHAIN_ID = "0xaa36a7";

export default function Wallet() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    // Получение данных о текущем аккаунте из localStorage
    const accountFromLocalStorage = localStorage.getItem("account");
    if (accountFromLocalStorage) {
      setCurrentAccount(accountFromLocalStorage);
    }
  }, []);

  const switchNetwork = async () => {
    try {
      // Попробуем переключиться на сеть, если она уже добавлена
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // Если сеть еще не добавлена, то добавляем её
      if (switchError.code === 4902) {
        try {
          await window.ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: "Sepolia Test Network",
                rpcUrls: ["https://rpc.sepolia.dev/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
                nativeCurrency: {
                  name: "SepoliaETH",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error("Ошибка при добавлении сети Sepolia:", addError);
        }
      } else {
        console.error("Ошибка при переключении на сеть Sepolia:", switchError);
      }
    }
  };

  const handleConnect = async () => {
    if (!window.ethereum) {
      console.log("MetaMask не установлен");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      await switchNetwork();
      const accounts = await provider.send("eth_requestAccounts", []);
      // После успешного подключения, сохраняем аккаунт в localStorage
      localStorage.setItem("account", accounts[0]); // Замените 'значение_аккаунта' на полученное значение аккаунта
      setCurrentAccount(accounts[0]); // Также замените здесь
      await getAccountBalance(accounts[0]);
    } catch (error) {
      console.error("Ошибка подключения к MetaMask:", error);
    }
  };

  const handleDisconnect = () => {
    // Удаление данных об аккаунте из localStorage и обновление состояния
    localStorage.removeItem("account");
    setCurrentAccount(null);
  };

  const getAccountBalance = async (account: string) => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account);
      setBalance(formatEther(balance));
    }
  };

  return (
    <>
      {!currentAccount && (
        <button onClick={handleConnect}>Подключить кошелек</button>
      )}
      {currentAccount && (
        <>
          <p>Активный аккаунт: {currentAccount}</p>
          <p>Баланс: {balance} ETH</p>
          <button onClick={handleDisconnect}>Отключить кошелек</button>
          <SendTransaction />
        </>
      )}
    </>
  );
}
