"use client";

import { ConnectKitButton } from "connectkit";
import { Web3Provider } from "../components/Web3Provider";
import SwitchNetwork from "../components/SwitchNetwork";

export default function App() {
  return (
    <Web3Provider>
      <ConnectKitButton />
      <SwitchNetwork />
    </Web3Provider>
  );
}
