import React, { useEffect, useState } from "react";
import "./Numbers.css";
import Web3 from "web3";
import {
  mint_Contract_ABI,
  mint_Contract_Address,
  Egg_token_Contract_ABI,
  Egg_token_Contract_Address,
  Egg_token_Staking_Contract_ABI,
  Egg_token_Staking_Contract_Address,
  Egg_NFT_Staking_Contract_Address,
  Egg_NFT_Staking_Contract_ABI,
} from "../../Contract/Contract";
export default function Numbers() {
  const [ttotalStaked, setttotalStaked] = useState(0);
  const [ttotalStakers, setttotalStakers] = useState(0);
  const [ttotalSupplyValue, setttotalSupplyValue] = useState(0);
  const [tnftstaked, settnftstaked] = useState(0);





  const webSupply = new Web3("wss://ethereum-rpc.publicnode.com");

  const checkmintbalance = async () => {
      let contractOftokenstaking = new webSupply.eth.Contract(
        Egg_token_Staking_Contract_ABI,
        Egg_token_Staking_Contract_Address
      );
      let contractOfnftStaking = new webSupply.eth.Contract(
        Egg_NFT_Staking_Contract_ABI,
        Egg_NFT_Staking_Contract_Address
      );
      //total staked token
      let totalStaked = await contractOftokenstaking.methods
        .totalStaked()
        .call();
        let totalNFTStaked = await contractOfnftStaking.methods
        .totalStaked()
        .call();
        totalNFTStaked= Number(totalNFTStaked)/Number(1000000000000000000)
        totalStaked= Number(totalStaked)/Number(1000000000000000000)
       let ttotalstaked
       ttotalstaked=Number(totalNFTStaked)+Number(totalStaked)
       setttotalStaked(ttotalstaked);
       //total stakers
       let totalStakers = await contractOftokenstaking.methods
       .totalStakers()
       .call();
       let totalNFTStakers = await contractOfnftStaking.methods
       .totalStakers()
       .call();
       let ttotalstakers
       ttotalstakers=Number(totalStakers)+Number(totalNFTStakers)
       console.log("ttotalstakers",ttotalstakers);
       setttotalStakers(ttotalstakers);

       // total minted nfts
       let ttotalSupplyValue;
        let contractOf1 = new webSupply.eth.Contract(
          mint_Contract_ABI[0],
          mint_Contract_Address[0]
        );
        let totalSupplyValue1 = await contractOf1.methods.totalSupply().call();
        console.log("totalSupplyValue1",totalSupplyValue1);
        let contractOf2 = new webSupply.eth.Contract(
          mint_Contract_ABI[1],
          mint_Contract_Address[1]
        );
        let totalSupplyValue2 = await contractOf2.methods.totalSupply().call();
        let contractOf3 = new webSupply.eth.Contract(
          mint_Contract_ABI[2],
          mint_Contract_Address[2]
        );
        let totalSupplyValue3 = await contractOf3.methods.totalSupply().call();

        ttotalSupplyValue=Number(totalSupplyValue1)+Number(totalSupplyValue2)+Number(totalSupplyValue3)

            setttotalSupplyValue(Number(ttotalSupplyValue))

            // total nft staked
            let totalNFTidsStaked = await contractOfnftStaking.methods
            .totalNFTStaked().call();
            settnftstaked(Number(totalNFTidsStaked));

    }

  useEffect(() => {
    checkmintbalance();
    ;
  },);

  return (
    <div className="eg_numbers">
      <div className="container">
        <div className="numbers_items ">
          <div className="inner_number_box z_upper">
            <h1>Total $AVENT Staked</h1>
            <h6>{parseFloat(ttotalStaked).toFixed(2)}</h6>
          </div>
          <div className="inner_number_box z_upper">
            <h1>Total NFT Minted</h1>
            <h6>{ttotalSupplyValue}</h6>
          </div>
          <div
            className="inner_number_box z_upper"
            style={{ background: "linear-gradient(35deg, #2e3192, #00ffe9)" }}
          >
            <h1 style={{ color: "#050505" }}>APY</h1>
            <h6 style={{ color: "#050505" }}>4 Plans</h6>
          </div>
          <div className="inner_number_box z_upper">
            <h1>Total Stakers</h1>
            <h6>{ttotalStakers}</h6>
          </div>
          <div className="inner_number_box z_upper">
            <h1>Total NFT Staked</h1>
            <h6>{tnftstaked}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
