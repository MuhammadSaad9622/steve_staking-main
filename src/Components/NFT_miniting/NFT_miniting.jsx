import React, { useEffect, useState } from "react";
import "./NFT_miniting.css";

import mint from "../Assets/Mint-blue.png";
import mint2 from "../Assets/Mint-green.png";
import mint3 from "../Assets/Mint-purple.png";
import mint4 from "../Assets/Miint-orange.png";
// import mint from "../Assets/Mint-blue.mp4";
// import mint2 from "../Assets/Mint-green.mp4";
// import mint3 from "../Assets/Mint-purple.mp4";
// import mint4 from "../Assets/Miint-orange.mp4";
import NFTCard from "./NFTCard";
import Web3 from "web3";
import { SmileFilled, SmileTwoTone } from '@ant-design/icons';

import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import {
  mint_Contract_ABI,
  mint_Contract_Address,
  Egg_token_Contract_ABI,
  Egg_token_Contract_Address,
} from "../../Contract/Contract";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

const nftDataShow = [
  {
    name: "Aventa Level 1",
    minted: "350",
    price: 1000,
    price2: 0.03,
    video: "/Mint-blue.mp4",
    totalSupply: 0,
  },
  {
    name: "Aventa Level 2",
    minted: "250",
    price: 750,
    price2: 0.05,
    video: "/Mint-green.mp4",
    totalSupply: 0,
  },
  {
    name: "Aventa Level 3",
    minted: "150",
    price: 500,
    price2: 0.07,
    video: "/Mint-purple.mp4",
    totalSupply: 0,
  },
];

export default function NFT_miniting() {
  const [nftData, setNftData] = useState(nftDataShow);
  const [spinner, setspinner] = useState(Array(nftDataShow.length).fill(false));

  const { address } = useAccount();
  const [cost, setcost] = useState(0);

  const webSupply = new Web3("wss://ethereum-rpc.publicnode.com");

  const Mint = async (index, isToken) => {
    try {
      console.log("isToken", isToken);
      setspinner((prevState) => {
        const newState = [...prevState];
        newState[index] = true;
        return newState;
      });
  
      let contractOf = new webSupply.eth.Contract(
        mint_Contract_ABI[index],
        mint_Contract_Address[index]
      );
  
      if (isToken === "token") {
        await mintWithToken(contractOf, index);
      } else {
        await mintWithETH(contractOf, index);
      }
    } catch (error) {
      console.error("Minting error:", error);
      handleMintingError(error);
    } finally {
      setspinner((prevState) => {
        const newState = [...prevState];
        newState[index] = false;
        return newState;
      });
    }
  };
  
  const mintWithToken = async (contractOf, index) => {
    try {
      let mintcost = await contractOf.methods.tokencost().call();
      let value = mintcost;
  
      console.log("MintToken", value);
  
      // Check token balance
      const tokenBalance = await checkTokenBalance(address, Egg_token_Contract_Address);
      if (Number(tokenBalance) < Number(value)) {
        throw new Error("Insufficient token balance");
      }
  
      const approveRequest = await prepareWriteContract({
        address: Egg_token_Contract_Address,
        abi: Egg_token_Contract_ABI,
        functionName: "approve",
        args: [mint_Contract_Address[index], value.toString()],
        account: address,
      });
  
      const { hash: approveHash } = await writeContract(approveRequest);
      await waitForTransaction({ hash: approveHash });
      toast.success("Approve Transaction Completed");
  
      const mintRequest = await prepareWriteContract({
        address: mint_Contract_Address[index],
        abi: mint_Contract_ABI[index],
        functionName: "mintwithToken",
        args: [1, value.toString()],
        account: address,
      });
  
      const { hash: mintHash } = await writeContract(mintRequest);
      await waitForTransaction({ hash: mintHash });
      toast.success("Minting Transaction Completed");
    } catch (error) {
      console.error("Token minting error:", error);
      throw error;
    }
  };
  
  const mintWithETH = async (contractOf, index) => {
    try {
      let mintcost = await contractOf.methods.ethcost().call();
      let value = mintcost;
  
      console.log("MintETH", value);
  
      // Check ETH balance
      const ethBalance = await webSupply.eth.getBalance(address);
      if (Number(ethBalance) < Number(value)) {
        throw new Error("Insufficient ETH balance");
      }
  
      const request = await prepareWriteContract({
        address: mint_Contract_Address[index],
        abi: mint_Contract_ABI[index],
        functionName: "mintwithETH",
        args: [1],
        value: value.toString(),
        account: address,
      });
  
      const { hash } = await writeContract(request);
      await waitForTransaction({ hash });
      toast.success("Minting Transaction Completed");
    } catch (error) {
      console.error("ETH minting error:", error);
      throw error;
    }
  };
  
  const checkTokenBalance = async (address, tokenAddress) => {
    const tokenContract = new webSupply.eth.Contract(Egg_token_Contract_ABI, tokenAddress);
    return await tokenContract.methods.balanceOf(address).call();
  };
  
  const handleMintingError = (error) => {
    if (error.message.includes("user rejected transaction")) {
      toast.error("Transaction rejected by user");
    } else if (error.message.includes("insufficient funds")) {
      toast.error("Insufficient funds for gas * price + value");
    } else if (error.message.includes("Insufficient token balance")) {
      toast.error("Insufficient token balance for minting");
    } else if (error.message.includes("Insufficient ETH balance")) {
      toast.error("Insufficient ETH balance for minting");
    } else {
      toast.error("An error occurred during minting. Please try again.");
    }
  };

  const checkcost = async () => {
    const newData = [...nftData]; // Make a copy of the current state
    for (let i = 0; i < mint_Contract_Address.length; i++) {

      let contractOf = new webSupply.eth.Contract(
        mint_Contract_ABI[i],
        mint_Contract_Address[i]
      );
      let totalSupplyValue = await contractOf.methods.totalSupply().call();
      // nftData[i].totalSupply = Number(5);
      console.log("totalSupplyValue", totalSupplyValue)
      newData[i] = { ...newData[i], totalSupply: Number(totalSupplyValue) };
      // let mintcost = await contractOf.methods.cost().call();
      // console.log("totalSupplyValue",parseInt(mintcost)/1000000000000000000);
      // nftData[i].price = parseInt(mintcost) / 1000000000000000000;
    }
    setNftData(newData);
    let contractOf = new webSupply.eth.Contract(
      mint_Contract_ABI[0],
      mint_Contract_Address[0]
    );
    // let mintcost = await contractOf.methods.cost().call();
    // // console.log("mintcost", mintcost);
    // setcost(mintcost);
    // console.log("nftData",nftData);
  };

  useEffect(() => {
    checkcost();
  }, []);

  console.log("nftData", nftData)
  return (
    <div className="main_nft_minitig">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 z_upper">
            <h1 className="mint_he z_upper">Mint your NFT</h1>
            <p className="mint_he z_upper">
              MINT your NFTs and employ them to amplify your APY.
            </p>
          </div>
          <div className="centered-table">
            <table>
              <thead>
                <tr>
                  <th>Sr no</th>
                  <th>NFT</th>
                  <th>Boosted Apy</th>
                </tr>
              </thead>
              <tbody>
                {nftData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      {index === 0
                        ? "5%"
                        : index === 1
                          ? "10%"
                          : index === 2
                            ? "15%"
                            : "100%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row justify-content-center my-5">
          <div className="col-md-12">
            <div className="row">
              {nftData.map((item, index) => (
                <NFTCard
                  key={index}
                  index={index}
                  {...item}
                  onclick={Mint}
                  spinner={spinner[index]}
                  totalSupplyValue={item.totalSupply}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
