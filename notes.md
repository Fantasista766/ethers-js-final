# Проект

Для проекта мне нужно переписать весь прошлый код с использованием ConnectKit и wagmi. Мне необходимо сделать подключение кошелька через ConnectKit, а чтение баланса, отправку транзакции, подключение к контракту и все остальные предыдущие практики через Wagmi.
В качестве UI-библиотеки я хочу использовать Radix UI. Библиотека позволяет импортировать только нужный компонент, а также в ней удобно писать кастомные стили.

У меня есть заготовка для проекта:
src/app/page.stx

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "../utils/wagmiConfig";
import CurrentNetwork from "../components/CurrentNetwork";

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CurrentNetwork />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

src/utils/wagmiConfig.tsx

```typescript
import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
```

Будем внедрять практики по одной.

## Предыдущие практики

Практика 1) Получение названия и chainId текущей сети. Здесь понадобится метод provider.getNetwork(). Внедри этот код в проект с компоненте CurrentNetwork

```typescript
import { ethers } from "ethers";
import { useEffect } from "react";

useEffect(() => {
  const provider = new ethers.InfuraProvider("mainnet", "ваш_infura_api_key");
  provider
    .getNetwork()
    .then((network) => {
      console.log("Network name:", network.name);
      console.log("Network chainId:", network.chainId);
    })
    .catch((error) => {
      console.error("Error getting network:", error);
    });
}, []);
```

Практика 2) Получение адреса из ENS домена

```typescript
import { ethers } from "ethers";
import { useEffect } from "react";

useEffect(() => {
  const provider = new ethers.InfuraProvider("mainnet", "ваш_infura_api_key");
  provider
    .resolveName("vitalik.eth")
    .then((ensAddress) => {
      console.log("Address:", ensAddress);
    })
    .catch((error) => {
      console.error("Error getting address:", error);
    });
}, []);
```

Практика 3) Получение ENS домена из адреса

```typescript
import { ethers } from "ethers";
import { useEffect } from "react";

useEffect(() => {
  const provider = new ethers.InfuraProvider("mainnet", "ваш_infura_api_key");
  provider
    .lookupAddress("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
    .then((ensName) => {
      console.log("ENS:", ensName);
    })
    .catch((error) => {
      console.error("Error getting ENS:", error);
    });
}, []);
```

Практика 4) Подключение метамаска к приложению

```typescript
import { useState } from "react";
import { ExternalProvider, getDefaultProvider, BrowserProvider } from "ethers";

// если у вас Typescript
declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);

  const handleClick = async () => {
    let provider;
    if (window.ethereum == null) {
      console.log(
        "MetaMask не установлен; используется провайдер только для чтения"
      );
      provider = getDefaultProvider("sepolia");
    } else {
      provider = new BrowserProvider(window.ethereum);
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        // метод eth_requestAccounts всегда возвращает массив аккаунтов, который пользователь разрешил вашему приложению
        // увидеть.
        // Первый аккаунт в возвращаемом массиве считается "выбранным" или "активным" в MetaMask.
        // Это поведение определено спецификацией EIP-1102.
        setCurrentAccount(accounts);
        console.log("Подключенный аккаунт:", accounts);
      } catch (error) {
        console.error("Ошибка подключения к MetaMask:", error);
      }
    }
  };

  return (
    <>
      {!currentAccount && (
        <button onClick={handleClick}>Подключить кошелек</button>
      )}
      {currentAccount && <p>Активный аккаунт: {currentAccount} </p>}
    </>
  );
}
```

Практика 5) Добавление переключения на тестовую сеть Sepolia

```typescript
import React, { useState } from "react";
import { BrowserProvider, ExternalProvider } from "ethers";

// Проверка типов для window.ethereum
declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x1C9", // Chain ID для сети Sepolia
            chainName: "Sepolia Test Network",
            rpcUrls: ["https://rpc.sepolia.dev/"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
    } catch (error) {
      console.error("Ошибка при переключении на сеть Sepolia:", error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.log("MetaMask не установлен");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      await switchNetwork(); // вызываем функцию
      const accounts = await provider.send("eth_requestAccounts", []);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("Ошибка подключения к MetaMask:", error);
    }
  };

  return (
    <>
      {!currentAccount && (
        <button onClick={connectWallet}>Подключить кошелек</button>
      )}
      {currentAccount && <p>Активный аккаунт: {currentAccount}</p>}
    </>
  );
}
```

Практика 6) Добавление визуализации адреса Ethereum с использованием [Jazzicon](https://www.npmjs.com/package/react-jazzicon)

```typescript
import { useState } from "react";
import { ethers } from "ethers";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

// Проверка типов для window.ethereum
declare global {
  interface Window {
    ethereum?: ethers.ExternalProvider;
  }
}

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);

  // Ваш предыдущий код

  return (
    <div>
      <h1>Ethereum Jazzicon Demo</h1>
      <button onClick={connectWallet}>
        {currentAccount ? "Кошелек подключен" : "Подключить кошелек"}
      </button>
      <div>
        {currentAccount && <p>Адрес кошелька: {currentAccount}</p>}
        {currentAccount && (
          <Jazzicon diameter={20} seed={jsNumberForAddress(currentAccount)} />
        )}
      </div>
    </div>
  );
}
```

Практика 7) Сохранение логина в localStorage и добавление кнопки отключения кошелька

```typescript

import { useState, useEffect } from "react";
import { ethers } from "ethers";

// если у вас Typescript
declare global {
  interface Window {
    ethereum?: ethers.ExternalProvider;
  }
}

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  useEffect(() => {
    // Получение данных о текущем аккаунте из localStorage
    const accountFromLocalStorage = localStorage.getItem('account');
    if (accountFromLocalStorage) {
      setCurrentAccount(accountFromLocalStorage);
    }
  }, []);

  const handleClick = async () => {
    // Код для подключения кошелька...
    // После успешного подключения, сохраняем аккаунт в localStorage
    localStorage.setItem('account', 'значение_аккаунта'); // Замените 'значение_аккаунта' на полученное значение аккаунта
    setCurrentAccount('значение_аккаунта'); // Также замените здесь
  };

  const handleDisconnect = () => {
    // Удаление данных об аккаунте из localStorage и обновление состояния
    localStorage.removeItem('account');
    setCurrentAccount(null);
  };

  return (
    <>
      {!currentAccount && <button onClick={handleClick}>Подключить кошелек</button>}
      {currentAccount && (
        <p>Активный аккаунт: {currentAccount}</p>
        <button onClick={handleDisconnect}>Отключить кошелек</button>
      )}
    </>
  );
}
```

Практика 8) Получение баланса ETH у подключённого кошелька

```typescript
import { useState, useEffect } from "react";
import { ethers, BrowserProvider, formatEther } from "ethers";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>(""); // Состояние для хранения отформатированного баланса кошелька в эфире (ETH).

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
        <button onClick={handleClick}>Подключить кошелек</button>
      )}
      {currentAccount && (
        <>
          <p>Активный аккаунт: {currentAccount}</p>
          <p>Баланс: {balance} ETH</p>
          <button onClick={handleDisconnect}>Отключить кошелек</button>
        </>
      )}
    </>
  );
}
```

Практика 9) Отправка транзакции

```typescript
import { useRef } from "react";
import { ethers, BrowserProvider, parseEther } from "ethers";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

export default function Home() {
  const toRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const handleSendEther = async (e) => {
    e.preventDefault();
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

Практика 10) Подключение к контракту на тестовой сети Sepolia и проверка его наличия

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

checkContract();
```

Практика 11) Доработка компонента React

```typescript
import { useState, useEffect } from "react";
import { ethers } from "ethers";

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
    (async () => {
      try {
        const value = await contract.isTrue();
        setIsTrue(value);
      } catch (error) {
        console.error("Ошибка при чтении контракта:", error);
      }
    })();
  }, []);

  const handleClick = async (newValue) => {
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const transaction = await contractWithSigner.setTrue(newValue);
      const result = await transaction.wait();
      console.log("Транзакция:", result);
    } catch (error) {
      console.error("Ошибка при отправке транзакции:", error);
    }
  };

  return (
    <div>
      <h2>Интерактив с контрактом</h2>
      <p>
        <label>Текущее состояние: {isTrue ? "Истина" : "Ложь"}</label>
      </p>
      <button onClick={() => handleClick(true)}>Установить в Истину</button>
      <button onClick={() => handleClick(false)}>Установить в Ложь</button>
    </div>
  );
}
```

Практика 12) Добавление поля ввода

```typescript
import { ethers } from "ethers";
import { useEffect, useState } from "react";

function Component() {
  const [smallUint, setSmallUint] = useState(0n);

  useEffect(() => {
    const fetchSmallUint = async () => {
      try {
        const externalSmallUint = await primitives.smallUint();
        setSmallUint(externalSmallUint);
        console.log("smallUint", smallUint);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSmallUint();
  }, []);

  function getPrimitiveSigner() {
    const provider = getProvider();
    return provider.getSigner();
  }

  const handleSubmit = async () => {
    try {
      const primitivesSigner = await getPrimitiveSigner();
      const tx = await primitivesSigner.smallUint();
      console.log("Transaction:", tx);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h2>Small Uint: {smallUint.toString()}</h2>
      <input
        type="number"
        min={0}
        max={256}
        onChange={(event) => setSmallUnit(event.current.value)}
      />
      <button onClick={handleSubmit}>Отправить новое значение</button>
    </div>
  );
}

export default Component;
```

Практика 13) Добавление инпута для изменния стейта при помощи функции из контракта

```typescript
import { ethers } from "ethers";
import { useEffect, useState } from "react";

function Component() {
  const [bigUint, setBigUint] = useState(0n);

  useEffect(() => {
    const fetchBigUint = async () => {
      try {
        const externalBigUint = await primitives.bigUint();
        setBigUint(externalBigUint);
        console.log("bigUint", bigUint);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBigUint();
  }, []);

  function getPrimitiveSigner() {
    const provider = getProvider();
    return provider.getSigner();
  }

  const handleSubmit = async () => {
    try {
      const primitivesSigner = await getPrimitiveSigner();
      const tx = await primitivesSigner.bigUint();
      console.log("Transaction:", tx);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h2>Big Uint: {bigUint.toString()}</h2>
      <input
        type="number"
        onChange={(event) => setBigUint(event.current.value)}
      />
      <button onClick={handleSubmit}>Отправить новое значение</button>
    </div>
  );
}

export default Component;
```

Практика 14) Подключение к контракту ERC-20 в тестовой сети Sepolia

```typescript
import { ethers } from "ethers";

// Подключаемся к провайдеру (например, MetaMask)
const provider = new BrowserProvider(window.ethereum);

// Запрашиваем пользователя подключить свой кошелек
await provider.send("eth_requestAccounts", []);

// Получаем объект подписывающего пользователя
const signer = await provider.getSigner();

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

// Создаем объекты контрактов для взаимодействия с ними
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

// Получаем адрес текущего пользователя
const address = await signer.getAddress();
// Проверяем текущее разрешение на количество токенов, которые можно тратить
const token0Allowance = await token0Contract.allowance(address, spenderAddress);
const token1Allowance = await token1Contract.allowance(address, spenderAddress);

// Выводим информацию о разрешениях в консоль
console.log({ token0Allowance });
console.log({ token1Allowance });

// Получаем количество десятичных знаков для токенов
const token0Decimals = await token0Contract.decimals();
const token1Decimals = await token1Contract.decimals();

// Задаем количество токенов, которое хотим утвердить
let token0Amount = ethers.parseUnits("10", token0Decimals); // 10 LINK
let token1Amount = ethers.parseUnits("5", token1Decimals); // 5 WETH

// Выводим заданное количество токенов в консоль
console.log({ token0Amount: token0Amount.toString() });
console.log({ token1Amount: token1Amount.toString() });

// Если разрешенное количество токенов меньше необходимого, запрашиваем увеличение
if (token0Allowance < token0Amount) {
  const tx = await token0Contract.approve(spenderAddress, token0Amount);
  await tx.wait();
  console.log("Token0 Approve OK", tx.hash);
}

if (token1Allowance < token1Amount) {
  const tx = await token1Contract.approve(spenderAddress, token1Amount);
  await tx.wait();
  console.log("Token1 Approve OK", tx.hash);
}
```
