"use client";

import { useEffect } from "react";
import { ConnectKitButton } from "connectkit";

import { Web3Provider } from "../components/Web3Provider";
import SwitchNetwork from "../components/SwitchNetwork";
import WalletManager from "../components/WalletManager";
import WalletBalance from "../components/WalletBalance";
import SendTransaction from "../components/SendTransaction";
import ContractInteraction from "../components/ContractInteraction";
import SmallUintField from "../components/SmallUintField";
import BigUintField from "../components/BigUintField";
import ERC20Interaction from "../components/ERC20Interaction";

import checkContract from "../utils/checkContract";

export default function App() {
  useEffect(() => {
    checkContract();
  }, []);

  return (
    <Web3Provider>
      <div className="container mx-auto p-6 max-w-screen-2xl">
        {/* Верхняя панель */}
        <div className="bg-gray-100 p-4 rounded shadow mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ConnectKitButton />
          <SwitchNetwork />
          <WalletManager />
          <WalletBalance />
        </div>

        {/* Сетка с компонентами */}
        <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <SendTransaction />
          <ContractInteraction />
          <SmallUintField />
          <BigUintField />
          <ERC20Interaction />
        </div>
      </div>
    </Web3Provider>
  );
}
