Отлично, все практики внедрены, теперь нужно навести красоту (рефакторинг, дизайн и т.д.). Вот мои фалы проекта

src/app/page.tsx

```typescript
"use client";

import { useEffect } from "react";
import { ConnectKitButton } from "connectkit";

import { Web3Provider } from "../components/Web3Provider";
import SwitchNetwork from "../components/SwitchNetwork";
import WalletManager from "../components/WalletManager";
import WalletBalance from "../components/WalletBalance";
import SendTransaction from "../components/SendTransaction";
import ContractInteraction from "../components/ContractInteraction";
import EntranceField from "../components/EntranceField";
import BigUintField from "../components/BigUintField";
import ERC20Interaction from "../components/ERC20Interaction";

import checkContract from "../utils/checkContract";

export default function App() {
  useEffect(() => {
    checkContract();
  }, []);

  return (
    <Web3Provider>
      <div className="p-4 space-y-4">
        <ConnectKitButton />
        <SwitchNetwork />
        <WalletManager />
        <WalletBalance />
        <SendTransaction />
        <ContractInteraction />
        <EntranceField />
        <BigUintField />
        <ERC20Interaction />
      </div>
    </Web3Provider>
  );
}
```

src/components/BigUintField.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const contractAddress = "0xF526C4fB3A22f208058163A34278989D1f953619";
const contractABI = [
  "function bigUint() public view returns (uint256)",
  "function setBiglUint(uint256 _bigUint) public",
];

const BigUintField = () => {
  const { address } = useAccount(); // Текущий аккаунт
  const [bigUint, setBigUint] = useState<bigint | null>(null);
  const [inputValue, setInputValue] = useState<string>(""); // Для нового значения
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Получение текущего значения bigUint из контракта
  const fetchBigUint = async () => {
    if (!address) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const value = await contract.bigUint();
      setBigUint(BigInt(value));
    } catch (error) {
      console.error("Ошибка при получении bigUint:", error);
    }
  };

  // Отправка нового значения в контракт
  const handleSubmit = async () => {
    if (!address) {
      alert("Подключите кошелек, чтобы отправить данные.");
      return;
    }

    const parsedValue = BigInt(inputValue);
    if (parsedValue < 0) {
      alert("Введите положительное число.");
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      console.log("Отправка транзакции...");
      const tx = await contract.setBiglUint(parsedValue);
      console.log("Транзакция отправлена:", tx);

      const receipt = await tx.wait();
      console.log("Транзакция подтверждена:", receipt);

      await fetchBigUint(); // Обновление значения после успешной транзакции
    } catch (error) {
      console.error("Ошибка при отправке транзакции:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка значения bigUint при подключении кошелька
  useEffect(() => {
    if (address) {
      fetchBigUint();
    }
  }, [address]);

  return (
    <div className="container">
      <h2>
        Текущее значение bigUint:{" "}
        {bigUint !== null ? bigUint.toString() : "Загрузка..."}
      </h2>
      <div>
        <input
          type="number"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Отправка..." : "Отправить новое значение"}
        </button>
      </div>
    </div>
  );
};

export default BigUintField;
```

src/components/ContractInteraction.tsx

```typescript
import { useState, useEffect } from "react";
import { ethers, BrowserProvider, formatEther } from "ethers";

export default function Home() {
  const contractAddress = "0xF526C4fB3A22f208058163A34278989D1f953619";
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contractABI = [
    "function isTrue() public view returns (bool)",
    "function setTrue(bool _isTrue) public",
  ];
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  const [isTrue, setIsTrue] = useState(false);

  useEffect(() => {
    // Обновление данных при загрузке компонента
    updateContractState();
  }, []);

  // Обновление состояния переменной isTrue
  const updateContractState = async () => {
    try {
      const value = await contract.isTrue();
      setIsTrue(value);
    } catch (error) {
      console.error("Ошибка при чтении контракта:", error);
    }
  };

  // Отправка транзакции
  const handleClick = async (newValue: boolean) => {
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const transaction = await contractWithSigner.setTrue(newValue);
      console.log("Транзакция отправлена:", transaction);

      await transaction.wait(); // Ждём подтверждения транзакции
      console.log("Транзакция подтверждена");

      // Обновление данных после транзакции
      updateContractState();
    } catch (error) {
      console.error("Ошибка при отправке транзакции:", error);
    }
  };

  return (
    <div>
      <h2>Интерактив с контрактом</h2>
      <p>Текущее состояние: {isTrue ? "Истина" : "Ложь"}</p>
      <button onClick={() => handleClick(true)}>Установить в Истину</button>
      <br></br>
      <button onClick={() => handleClick(false)}>Установить в Ложь</button>
    </div>
  );
}
```

src/components/EntranceField.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const contractAddress = "0xF526C4fB3A22f208058163A34278989D1f953619";
const contractABI = [
  "function setSmallUint(uint8 _smallUint) public",
  "function smallUint() public view returns (uint8)",
];

const EntranceField = () => {
  const { address } = useAccount(); // Текущий аккаунт

  const [smallUint, setSmallUint] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Получение текущего значения smallUint из контракта
  const fetchSmallUint = async () => {
    if (!address) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const value = await contract.smallUint();
      setSmallUint(Number(value));
    } catch (error) {
      console.error("Ошибка при получении smallUint:", error);
    }
  };

  // Отправка нового значения в контракт
  const handleSubmit = async () => {
    if (!address) {
      alert("Подключите кошелек, чтобы отправить данные.");
      return;
    }

    const parsedValue = parseInt(inputValue, 10);
    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 255) {
      alert("Введите число от 0 до 255");
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      console.log("Отправка транзакции...");
      const tx = await contract.setSmallUint(parsedValue);
      console.log("Транзакция отправлена:", tx);

      const receipt = await tx.wait();
      console.log("Транзакция подтверждена:", receipt);

      await fetchSmallUint(); // Обновление состояния после успешной транзакции
    } catch (error) {
      console.error("Ошибка при отправке транзакции:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка значения smallUint при подключении кошелька
  useEffect(() => {
    if (address) {
      fetchSmallUint();
    }
  }, [address]);

  return (
    <div className="container">
      <h2>
        Текущее значение smallUint:{" "}
        {smallUint !== null ? smallUint : "Загрузка..."}
      </h2>
      <div>
        <input
          type="number"
          min={0}
          max={255}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Отправка..." : "Отправить новое значение"}
        </button>
      </div>
    </div>
  );
};

export default EntranceField;
```

src/components/ERC20Interaction.tsx

```typescript
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
```

src/components/SendTransaction.tsx

```typescript
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
```

src/components/SwitchNetwork.tsx

```typescript
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
```

src/components/WalletBalance.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import { ethers, BrowserProvider, formatEther } from "ethers";
import { useAccount } from "wagmi";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

export default function WalletBalance() {
  const { chain, address, isConnected } = useAccount(); // Текущий аккаунт
  const [balance, setBalance] = useState<string>(""); // Баланс в ETH

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && address && window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(address);
          setBalance(formatEther(balance));
        } catch (error) {
          console.error("Ошибка при получении баланса:", error);
        }
      }
    };

    fetchBalance();
  }, [isConnected, address, chain?.id]); // Добавляем `chain?.id` как зависимость для обновления при смене сети

  return (
    <div>
      {isConnected && address && (
        <>
          <p>Баланс: {balance || "Загрузка..."} ETH</p>
        </>
      )}
    </div>
  );
}
```

src/components/WalletManager.tsx

```typescript
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
```

src/components/Web3Provider.tsx

```typescript
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";

import config from "../utils/wagmiConfig";

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
```

src/utils/checkContract.tsx

```typescript
import { InfuraProvider } from "ethers";

async function checkContract() {
  const contractAddress = "0xF526C4fB3A22f208058163A34278989D1f953619";
  const provider = new InfuraProvider("sepolia");

  try {
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
      console.log("Контракт по указанному адресу не найден.");
    } else {
      console.log("Контракт успешно найден.");
    }
  } catch (error) {
    console.error("Ошибка при проверке контракта:", error);
  }
}

export default checkContract;
```

src/utils/wagmiConfig.tsx

```typescript
import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, metaMask, safe } from "wagmi/connectors";

const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected(), metaMask(), safe()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export default config;
```
