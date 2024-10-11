import logo from "./logo.svg";
import "./App.css";
import Footer from "./Components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Components/Header/Header";
import Landing_page from "./Components/Landing_page/Landing_page";
import All_staking from "./Components/All_staking/All_staking";
import How_mk_works from "./Components/How_mk_works/How_mk_works";
import NFT_miniting from "./Components/NFT_miniting/NFT_miniting";
import Token_staking from "./Components/Token_staking/Token_staking";
import Nft_token_tab from "./Components/Nft_token_tab/Nft_token_tab";
import Numbers from "./Components/Numbers/Numbers";
import { Toaster } from "react-hot-toast";
import { useRef, useState } from "react";

function App() {
  // Create a ref for the Token_staking component
  const tokenStakingRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  const scrollToTokenMinting = () => {
    tokenStakingRef.current.scrollIntoView({ behavior: "smooth" });
    setActiveTab(1); // Set the active tab to 1 for Mint NFTs
  };
  const scrollToNFTStaking = () => {
    tokenStakingRef.current.scrollIntoView({ behavior: "smooth" });
    setActiveTab(0); // Set the active tab to 1 for Mint NFTs
  };
  return (
    <div className='App'>
      <Toaster />
      <Header scrollToTokenMinting={scrollToTokenMinting} />
      <Landing_page scrollToNFTStaking={scrollToNFTStaking} />
      <Numbers />
      <All_staking />
      <div ref={tokenStakingRef}>
        <Token_staking setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>{" "}
      <How_mk_works />
      <Footer />
    </div>
  );
}

export default App;
