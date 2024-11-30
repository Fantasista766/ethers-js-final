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
