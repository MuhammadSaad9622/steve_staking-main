import React from "react";
import "./Landing_page.css";
import Numbers from "../Numbers/Numbers";

export default function Landing_page({ scrollToNFTStaking }) {
  return (
    <div className="main_landing_page">
      {/* <div className="overy"></div> */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 z_upper">
            <h1 className="main_landing_head">
              MINT  STAKE
              <span className="stokedd"> EARN</span>
            </h1>
            <p className="landing_para site_pop">
              Mint NFTs using Aventa tokens and participate in our staking pool, which offers three different plans. Staking with your NFTs will earn you a booster in your APY, providing additional rewards based on your NFT ownership.
            </p>
            <div className="d-flex justify-content-center">
              <button onClick={() => scrollToNFTStaking()} className="landing_btn site_pop">Stake Now</button>
            </div>


          </div>
        </div>
        {/* <Numbers/> */}
      </div>
    </div>
  );
}
