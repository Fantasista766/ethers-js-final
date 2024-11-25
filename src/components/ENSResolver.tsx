"use client";

import { useEffect } from "react";
import { useEnsAddress } from "wagmi";

const ENSResolver = () => {
  const {
    data: ensAddress,
    isError,
    isLoading,
    error,
  } = useEnsAddress({
    name: "vitalik.eth",
  });

  useEffect(() => {
    if (isLoading) console.log("Resolving ENS...");
    if (ensAddress) console.log("Resolved Address:", ensAddress);
    if (isError) console.error("Error resolving ENS:", error?.message);
  }, [ensAddress, isError, isLoading]);

  return (
    <div>
      <h2>ENS Resolver</h2>
      {isLoading && <p>Resolving ENS...</p>}
      {ensAddress ? (
        <p>Address: {ensAddress}</p>
      ) : (
        isError && <p>Error: {error?.message}</p>
      )}
    </div>
  );
};

export default ENSResolver;
