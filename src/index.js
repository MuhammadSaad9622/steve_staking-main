import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { mainnet } from "viem/chains";

const projectId = "ac09aec8ba932273ba8fcffbf74619e7";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
// Use imported chains instead of manually defining them
const chains = [mainnet];

const wagmiConfig = defaultWagmiConfig({
  chains, // Use the chains array here
  projectId,
  metadata,
});

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);

reportWebVitals();
