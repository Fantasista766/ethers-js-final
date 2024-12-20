import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";

import config from "../utils/wagmiConfig";

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <div className="min-h-screen flex flex-col">{children}</div>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
