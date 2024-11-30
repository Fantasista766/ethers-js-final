"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const spenderAddress = "0xA29D7612CdEf3b5514c18D90D7bFe730253ce533";
const tokenAddresses = {
  LINK: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
};

const tokenABI = [
  "function balanceOf(address _owner) public view returns (uint256 balance)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
  "function decimals() public pure returns (uint8)",
];

const ERC20Interaction = () => {
  const { address } = useAccount(); // Подключённый адрес пользователя
  const [token0Allowance, setToken0Allowance] = useState<string>("0");
  const [token1Allowance, setToken1Allowance] = useState<string>("0");
  const [token0Amount, setToken0Amount] = useState<string>("10"); // Default 10 LINK
  const [token1Amount, setToken1Amount] = useState<string>("5"); // Default 5 WETH
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      fetchAllowances();
    }
  }, [address]);

  const fetchAllowances = async () => {
    if (!address) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token0Contract = new ethers.Contract(
        tokenAddresses.LINK,
        tokenABI,
        signer
      );
      const token1Contract = new ethers.Contract(
        tokenAddresses.WETH,
        tokenABI,
        signer
      );

      const allowance0 = await token0Contract.allowance(
        address,
        spenderAddress
      );
      const allowance1 = await token1Contract.allowance(
        address,
        spenderAddress
      );

      setToken0Allowance(ethers.formatUnits(allowance0, 18)); // Assuming LINK has 18 decimals
      setToken1Allowance(ethers.formatUnits(allowance1, 18)); // Assuming WETH has 18 decimals
    } catch (error) {
      console.error("Ошибка при получении разрешений:", error);
    }
  };

  const handleApprove = async (token: "LINK" | "WETH") => {
    if (!address) {
      alert("Подключите кошелек.");
      return;
    }

    try {
      setIsLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        token === "LINK" ? tokenAddresses.LINK : tokenAddresses.WETH,
        tokenABI,
        signer
      );

      const decimals = await tokenContract.decimals();
      const amount = ethers.parseUnits(
        token === "LINK" ? token0Amount : token1Amount,
        decimals
      );

      const tx = await tokenContract.approve(spenderAddress, amount);
      console.log(`Отправка транзакции на утверждение ${token}...`);
      await tx.wait();
      console.log(`${token} утверждено!`);

      fetchAllowances(); // Обновить отображение разрешений
    } catch (error) {
      console.error(`Ошибка при утверждении ${token}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Взаимодействие с контрактами ERC-20</h2>
      <div>
        <h3>LINK</h3>
        <p>Разрешённое количество: {token0Allowance} LINK</p>
        <input
          type="number"
          value={token0Amount}
          onChange={(e) => setToken0Amount(e.target.value)}
          disabled={isLoading}
        />
        <button
          onClick={() => handleApprove("LINK")}
          disabled={isLoading || !address}
        >
          {isLoading ? "Обработка..." : "Утвердить LINK"}
        </button>
      </div>
      <div>
        <h3>WETH</h3>
        <p>Разрешённое количество: {token1Allowance} WETH</p>
        <input
          type="number"
          value={token1Amount}
          onChange={(e) => setToken1Amount(e.target.value)}
          disabled={isLoading}
        />
        <button
          onClick={() => handleApprove("WETH")}
          disabled={isLoading || !address}
        >
          {isLoading ? "Обработка..." : "Утвердить WETH"}
        </button>
      </div>
    </div>
  );
};

export default ERC20Interaction;
