import React from "react";

export default function NFTCard({ name, minted, price, price2, image, video, onclick, spinner, index, totalSupplyValue }, props) {
  return (
    <div className="col-md-4 mt-3 mt-md-0 ">
      <div className="mint_nft_card">
        {/* <img src={image} className="mint_img" alt="" /> */}
        <video className="w-100 min_video" controls loop autoPlay muted >
          <source src={video} type="video/mp4" />

          Your browser does not support the video tag.
        </video>

        <div className="mint_box_content">
          <h4 className="site_pop text-white">{name}</h4>
          <h6 className="site_pop text-white">Minted : {totalSupplyValue}/{minted}</h6>
          {/* <p className="site_pop">
            Price: <span style={{ color: "#fff" }}>{price} Aventa tokens</span>
          </p> */}
          <p className="site_pop">
            ETH Price: <span style={{ color: "#fff" }}>{price2} ETH</span>
          </p>
          <div className="d-flex justify-content-center " style={{ gap: "20px" }}>
            {/* <button className="mint_btn_box site_font" onClick={() => onclick(index, "token")}>
              {spinner ? "Loading..." : "Mint With Token"}
            </button> */}
            <button className="mint_btn_box site_font" onClick={() => onclick(index, "ETH")}>
              {spinner ? "Loading..." : "Mint With ETH"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
