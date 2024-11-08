import { ethers } from "ethers";
import { useEffect } from "react";
import "dotenv/config";

export default function GetDomainFromEns() {
  useEffect(() => {
    const provider = new ethers.InfuraProvider(
      "mainnet",
      process.env.INFURA_API_KEY
    );
    provider
      .lookupAddress("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
      .then((ensName) => {
        console.log("ENS:", ensName);
      })
      .catch((error) => {
        console.error("Error getting ENS:", error);
      });
  }, []);
}
