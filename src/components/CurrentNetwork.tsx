"use client";

import { useAccount } from "wagmi";
import { useEffect } from "react";

const CurrentNetwork = () => {
  const { chain } = useAccount();

  useEffect(() => {
    if (chain) {
      console.log("Network name:", chain.name);
      console.log("Network chainId:", chain.id);
    } else {
      console.log("No network connected");
    }
  }, [chain]);

  return (
    <div>
      <h2>Current Network</h2>
      {chain ? (
        <div>
          <p>Network Name: {chain.name}</p>
          <p>Chain ID: {chain.id}</p>
        </div>
      ) : (
        <p>No network connected</p>
      )}
    </div>
  );
};

export default CurrentNetwork;
