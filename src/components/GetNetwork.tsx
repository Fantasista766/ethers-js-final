import { ethers } from "ethers";
import { useEffect } from "react";

export default function GetNetwork() {
  useEffect(() => {
    const provider = new ethers.InfuraProvider("sepolia");
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
}
