import React from "react";

const OfflineFallback = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.8)",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <h1>⚠️ You are offline. Please check your internet connection.</h1>
  </div>
);

export default OfflineFallback;
