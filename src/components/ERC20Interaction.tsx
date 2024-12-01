"use client";

import { useCallback, useEffect, useState } from "react";
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
  const { address } = useAccount();
  const [token0Allowance, setToken0Allowance] = useState<string>("0");
  const [token1Allowance, setToken1Allowance] = useState<string>("0");
  const [token0Amount, setToken0Amount] = useState<string>("10");
  const [token1Amount, setToken1Amount] = useState<string>("5");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAllowances = useCallback(async () => {
    if (!address) return;

    try {
      const provider = new ethers.BrowserProvider(
        window.ethereum as ethers.Eip1193Provider
      );
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

      setToken0Allowance(ethers.formatUnits(allowance0, 18));
      setToken1Allowance(ethers.formatUnits(allowance1, 18));
    } catch (error) {
      console.error("Ошибка при получении разрешений:", error);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchAllowances();
    }
  }, [address, fetchAllowances]);

  const handleApprove = async (token: "LINK" | "WETH") => {
    if (!address) {
      alert("Подключите кошелек.");
      return;
    }

    try {
      setIsLoading(true);

      const provider = new ethers.BrowserProvider(
        window.ethereum as ethers.Eip1193Provider
      );
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

      fetchAllowances();
    } catch (error) {
      console.error(`Ошибка при утверждении ${token}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md space-y-6">
      <h2 className="text-lg font-semibold text-gray-700">
        Взаимодействие с контрактами ERC-20
      </h2>
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-gray-600">LINK</h3>
          <p className="text-sm text-gray-500">
            Разрешённое количество: {token0Allowance} LINK
          </p>
          <div className="flex items-center gap-4">
            <input
              type="number"
              className="border rounded p-2 w-1/2"
              value={token0Amount}
              onChange={(e) => setToken0Amount(e.target.value)}
              disabled={isLoading}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => handleApprove("LINK")}
              disabled={isLoading || !address}
            >
              {isLoading ? "Обработка..." : "Утвердить LINK"}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-gray-600">WETH</h3>
          <p className="text-sm text-gray-500">
            Разрешённое количество: {token1Allowance} WETH
          </p>
          <div className="flex items-center gap-4">
            <input
              type="number"
              className="border rounded p-2 w-1/2"
              value={token1Amount}
              onChange={(e) => setToken1Amount(e.target.value)}
              disabled={isLoading}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => handleApprove("WETH")}
              disabled={isLoading || !address}
            >
              {isLoading ? "Обработка..." : "Утвердить WETH"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERC20Interaction;
