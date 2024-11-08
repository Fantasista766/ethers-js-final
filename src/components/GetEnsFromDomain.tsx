import { ethers } from "ethers";
import { useEffect } from "react";
import "dotenv/config";

export default function GetEnsFromDomain() {
  useEffect(() => {
    const provider = new ethers.InfuraProvider(
      "mainnet",
      process.env.INFURA_API_KEY
    );
    provider
      .resolveName("vitalik.eth")
      .then((ensAddress) => {
        console.log("Address:", ensAddress);
      })
      .catch((error) => {
        console.error("Error getting address:", error);
      });
  }, []);
}
