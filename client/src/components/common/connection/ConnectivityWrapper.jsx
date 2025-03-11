import React from "react";
import { useConnectivity } from "./ConnectivityContext";
import OfflineFallback from "./OfflineFallback";

const ConnectivityWrapper = ({ children }) => {
  const isOnline = useConnectivity();

  if (!isOnline) {
    return <OfflineFallback />;
  }

  return children;
};

export default ConnectivityWrapper;
