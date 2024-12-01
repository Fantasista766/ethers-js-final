"use client";

import { useRef } from "react";
import { BrowserProvider, Eip1193Provider, parseEther } from "ethers";
import Button from "./Button";

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export default function SendTransaction() {
  const toRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const handleSendEther = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.ethereum) {
      console.log("MetaMask не установлен");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: toRef.current?.value,
        value: parseEther(amountRef.current?.value || "0"),
      });
      await tx.wait();
    } catch (error) {
      console.error("Ошибка при отправке ETH:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-semibold text-gray-700">Отправить ETH</h2>
      <form onSubmit={handleSendEther} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Адрес получателя:
          </label>
          <input
            ref={toRef}
            type="text"
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Сумма (ETH):
          </label>
          <input
            ref={amountRef}
            type="text"
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
        </div>
        <Button type="submit">Отправить</Button>
      </form>
    </div>
  );
}
