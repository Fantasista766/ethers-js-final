import { useState, useEffect } from "react";
import { formatEther } from "ethers";
import { getProvider } from "../utils/ethersProvider";
import SendTransaction from "./SendTransaction";

export default function Wallet() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    const account = localStorage.getItem("account");
    if (account) setCurrentAccount(account);
  }, []);

  const handleConnect = async () => {
    try {
      const provider = await getProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      localStorage.setItem("account", accounts[0]);
      setCurrentAccount(accounts[0]);
      const balance = await provider.getBalance(accounts[0]);
      setBalance(formatEther(balance));
    } catch (error) {
      console.error("Ошибка подключения к MetaMask:", error);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("account");
    setCurrentAccount(null);
  };

  return (
    <div>
      {!currentAccount ? (
        <button onClick={handleConnect}>Подключить кошелек</button>
      ) : (
        <>
          <p>Аккаунт: {currentAccount}</p>
          <p>Баланс: {balance} ETH</p>
          <button onClick={handleDisconnect}>Отключить кошелек</button>
          <SendTransaction />
        </>
      )}
    </div>
  );
}
