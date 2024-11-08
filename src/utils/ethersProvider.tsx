// src/utils/ethersProvider.ts
import { BrowserProvider, Eip1193Provider } from "ethers";

const SEPOLIA_CHAIN_ID = "0xaa36a7";

export async function getProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask не установлен");
  }
  const provider = new BrowserProvider(window.ethereum);
  await switchToSepolia(provider);
  return provider;
}

export async function switchToSepolia(provider: BrowserProvider) {
  try {
    await provider.send("wallet_switchEthereumChain", [
      { chainId: SEPOLIA_CHAIN_ID },
    ]);
  } catch (error: any) {
    if (error.code === 4902) {
      await provider.send("wallet_addEthereumChain", [
        {
          chainId: SEPOLIA_CHAIN_ID,
          chainName: "Sepolia Test Network",
          rpcUrls: ["https://rpc.sepolia.dev/"],
          blockExplorerUrls: ["https://sepolia.etherscan.io"],
          nativeCurrency: {
            name: "SepoliaETH",
            symbol: "ETH",
            decimals: 18,
          },
        },
      ]);
    } else {
      throw error;
    }
  }
}
