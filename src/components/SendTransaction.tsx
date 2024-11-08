import { useRef } from "react";
import { BrowserProvider, Eip1193Provider, parseEther } from "ethers";

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
      console.log(tx);
      const response = await tx.wait();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSendEther}>
      <h2>Отправить ETH</h2>
      <label>
        Адрес получателя:
        <input ref={toRef} type="text" style={{ border: "1px solid black" }} />
      </label>
      <label>
        Сумма (ETH):
        <input
          type="text"
          ref={amountRef}
          style={{ border: "1px solid black" }}
        />
      </label>
      <button type="submit">Отправить</button>
    </form>
  );
}
