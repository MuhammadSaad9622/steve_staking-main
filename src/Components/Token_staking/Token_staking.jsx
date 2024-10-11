import React from "react";
import level from "../Assets/level.png";
import level2 from "../Assets/level2.svg";
import "./Token_staking.css";
import calim from "../Assets/claim_card.jpeg";
import stake from "../Assets/stake_card.png";
import refresh from "../Assets/refresh.png";
import withd from "../Assets/withdraw.png";
import Nft_token_tab from "../Nft_token_tab/Nft_token_tab";
export default function Token_staking({ activeTab, setActiveTab }) {
  return (
    <div className="main_token_staking">
      <div className="stking_overlay"></div>
      <div className="container">


        <Nft_token_tab activeTab={activeTab} setActiveTab={setActiveTab} />

      </div>
    </div>
  );
}
