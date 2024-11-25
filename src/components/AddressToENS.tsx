"use client";

import { useEffect } from "react";
import { useEnsName } from "wagmi";

const AddressToENS = () => {
  const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
  const { data: ensName, isError, isLoading, error } = useEnsName({ address });

  useEffect(() => {
    if (isLoading) console.log("Looking up ENS...");
    if (ensName) console.log("Resolved ENS Name:", ensName);
    if (isError) console.error("Error resolving ENS name:", error?.message);
  }, [ensName, isError, isLoading]);

  return (
    <div>
      <h2>ENS Lookup</h2>
      {isLoading && <p>Looking up ENS...</p>}
      {ensName ? (
        <p>ENS Name: {ensName}</p>
      ) : (
        isError && <p>Error: {error?.message}</p>
      )}
    </div>
  );
};

export default AddressToENS;
