import React, { useCallback, useEffect, useState } from "react";
import "./Nft_token_tab.css";
import Web3 from "web3";
import { useAccount } from "wagmi";
import refresh from "../Assets/refresh.png";
import withd from "../Assets/withdraw.png";
import level from "../Assets/level.png";
import level2 from "../Assets/level2.svg";
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
  Egg_NFT_Staking_Contract_Address,
  Egg_NFT_Staking_Contract_ABI,
} from "../../Contract/Contract";
import toast from "react-hot-toast";
import Countdown from "react-countdown";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { CircularProgress } from "@mui/material";

const levelMap = [
  { level: 1, nft: 3, mintbalance: 0 },
  { level: 2, nft: 3, mintbalance: 0 },
  { level: 3, nft: 3, mintbalance: 0 },
];

export default function NFTStakings({ daysMap, value }) {
  const { address } = useAccount();
  const [loackableDays, setloackableDays] = useState(14);
  const [selectlevel, setSelectlevel] = useState(1);
  const [getinputValue, setGetinputValue] = useState("");
  const [stakeSpinner, setStakeSpinner] = useState(false);
  const [Stake_History_show, setStake_History_show] = useState([]);
  const [spinnerClaim, setspinnerClaim] = useState(false);
  const [totalfuturerewards, setTotalFutureRewards] = useState(0);
  const [totalclaimedrewards, setTotalClaimedRewards] = useState(0);
  const [userDepositInfo, setUserDepositInfo] = useState([]);
  const [stakedPlans, setStakedPlans] = useState([]);
  const [tokenbalance, setTokenBalance] = useState(0);
  const [unStakeSpinner, setunStakeSpinner] = useState("");
  const [apy, setApy] = useState("5 %");
  const [isLoading, setIsLoading] = useState(false);

  const webSupply = new Web3("wss://ethereum-rpc.publicnode.com");
 
  const checkapy = useCallback(() => {
    const apyMap = { 1: "5 %", 2: "10 %", 3: "15 %", 4: "100 %" };
    setApy(apyMap[selectlevel] || "5 %");
  }, [selectlevel]);

  const checkmintbalance = useCallback(async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      for (let i = 0; i < mint_Contract_Address.length; i++) {
        let contractOf = new webSupply.eth.Contract(
          mint_Contract_ABI[i],
          mint_Contract_Address[i]
        );
        let balance = await contractOf.methods.balanceOf(address).call();
        levelMap[i].mintbalance = Number(balance);
      }

      const contractOfToken = new webSupply.eth.Contract(Egg_token_Contract_ABI, Egg_token_Contract_Address);
      const contractOfStaking = new webSupply.eth.Contract(Egg_NFT_Staking_Contract_ABI, Egg_NFT_Staking_Contract_Address);

      const balance = await contractOfToken.methods.balanceOf(address).call();
      setTokenBalance(webSupply.utils.fromWei(balance, 'ether'));

      
      let plans = [14, 30, 60, 90]
      if (plans?.length > 0) {
        let totalFuture = 0;
        let totalClaimed = 0;

        for (const plan of plans) {
          const reward = await contractOfStaking.methods.futureRewards(address, plan).call();
          const futureReward = Number(webSupply.utils.fromWei(reward.reward, 'ether'));
          const claimedReward = Number(webSupply.utils.fromWei(reward.claimedAmount, 'ether'));

          totalFuture += futureReward;
          totalClaimed += claimedReward;
        }

        setTotalFutureRewards(totalFuture);
        setTotalClaimedRewards(totalClaimed);
      }
    } catch (error) {
      console.error("Error fetching balance and rewards:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const Stake_History = useCallback(async () => {
    try {
      if (!address) {
        return;
      }

      // setIsLoading(true);

      let stakingContractOf = new webSupply.eth.Contract(
        Egg_NFT_Staking_Contract_ABI,
        Egg_NFT_Staking_Contract_Address
      );

      const userStakedPlans = await stakingContractOf.methods.getUserStakedPlans(address).call();
      setStakedPlans(userStakedPlans);

      const userStakesCount = await Promise.all(
        userStakedPlans.map(async (plan) => {
          let number = await stakingContractOf.methods.getUserStakesCount(address, plan).call();
          return { plan: plan, count: number };
        })
      );

      let userDepositInfo = await Promise.all(
        userStakesCount.map(async (item) => {
          let data = [];
          for (let i = 0; i < item.count; i++) {
            let newData = await stakingContractOf.methods.getUserDepositInfo(address, item.plan, i).call();
            let amount = Number(newData.amount) / Number(1000000000000000000);
            if (!newData.hasHarvested) {
              data.push({ ...newData, plan: item.plan, index: i, amount });
            }
          }
          return data;
        })
      );
      userDepositInfo = userDepositInfo.flat();
      setUserDepositInfo(userDepositInfo);
      setStake_History_show(userDepositInfo);
    } catch (error) {
      console.error("Error fetching stake history:", error);
    } finally {
      // setIsLoading(false);
    }
  }, [address, webSupply.eth.Contract]);


  useEffect(() => {
    checkmintbalance();
  }, [checkmintbalance])

  useEffect(() => {
    checkapy();
  }, [checkapy]);

  useEffect(() => {
    Stake_History();
  }, [value,]);

  const stakeNFT = async () => {
    try {
      if (!address) {
        setStakeSpinner(false);
        return;
      }
      setStakeSpinner(true);
      let contractOf = new webSupply.eth.Contract(
        mint_Contract_ABI[selectlevel - 1],
        mint_Contract_Address[selectlevel - 1]
      );
      let walletOfOwner = await contractOf.methods
        .walletOfOwner(address)
        .call();

      if (walletOfOwner?.length !== 0) {
        if (getinputValue !== "") {
          let valueToken =
            Number(getinputValue) * Number(1000000000000000000);

          let amounts = valueToken.toLocaleString("fullwide", {
            useGrouping: false,
          });
          let amounts1 = parseInt(amounts);
          valueToken = amounts1.toLocaleString("fullwide", {
            useGrouping: false,
          });

          const { request } = await prepareWriteContract({
            address: Egg_token_Contract_Address,
            abi: Egg_token_Contract_ABI,
            functionName: "approve",
            args: [Egg_NFT_Staking_Contract_Address, valueToken.toString()],
            account: address,
          });
          const { hash } = await writeContract(request);
          const data = await waitForTransaction({
            hash,
          });
          toast.success("Transaction Completed");
          const approveAll = await prepareWriteContract({
            address: mint_Contract_Address[selectlevel - 1],
            abi: mint_Contract_ABI[selectlevel - 1],
            functionName: "setApprovalForAll",
            args: [Egg_NFT_Staking_Contract_Address, true],
            account: address,
            
          });
          console.log('Approval Request: ', request);
          const approveHash = await writeContract(approveAll?.request);
          const approvedata = await waitForTransaction({
            hash: approveHash.hash,
          });
          toast.success("Transaction Completed");

          setTimeout(async () => {
            setStakeSpinner(true);
            const { request } = await prepareWriteContract({
              address: Egg_NFT_Staking_Contract_Address,
              abi: Egg_NFT_Staking_Contract_ABI,
              functionName: "farm",
              args: [
                valueToken.toString(),
                loackableDays,
                Number(walletOfOwner[0]),
                mint_Contract_Address[selectlevel - 1],
              ],
              account: address,
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
              hash,
            });
            toast.success("Transaction Completed");
            setStakeSpinner(false);
            Stake_History();
          }, 3000);
        } else {
          toast.error("Please enter Token value First!");
          setStakeSpinner(false);
        }
      } else {
        toast.error("Sorry! You have no NFT");
        setStakeSpinner(false);
      }

    } catch (error) {
      setStakeSpinner(false);
      console.log(error);
    }
  };

  const Completionist = () => {
    return (
      <>
        <div className="text_days fs-5 ">Unstaked Time Reached!</div>
      </>
    );
  };

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <div className="text_days fs-5 ">
          {/* {days} D {hours} H {minutes} M {seconds} S */}
          {days}d : {hours}h : {minutes}m : {seconds}s
        </div>
      );
    }
  };

  const harvest = async (planDuration, index) => {
    try {
      if (address) {
        const { request } = await prepareWriteContract({
          address: Egg_NFT_Staking_Contract_Address,
          abi: Egg_NFT_Staking_Contract_ABI,
          functionName: "harvest",
          args: [planDuration, index],
          account: address,
        });
        const { hash } = await writeContract(request);
        const data = await waitForTransaction({
          hash,
        });
        toast.success("Transaction Completed");
        setunStakeSpinner("");
        Stake_History();
      } else {
        toast.error("Connect Wallet First!");
        setunStakeSpinner("");
      }
    } catch (error) {
      console.log(error);
      setunStakeSpinner("");
    }
  };

  const claimToken = async (index) => {
    try {
      if (address) {
        setspinnerClaim(true);
        const { request } = await prepareWriteContract({
          address: Egg_NFT_Staking_Contract_Address,
          abi: Egg_NFT_Staking_Contract_ABI,
          functionName: "claim",
          args: [],
          account: address,
        });
        const { hash } = await writeContract(request);
        const data = await waitForTransaction({
          hash,
        });
        toast.success("Transaction Completed");
        setspinnerClaim(false);
      } else {
        toast.error("Connect Wallet First!");
        setspinnerClaim(false);
      }
    } catch (error) {
      console.log(error);
      setspinnerClaim(false);
    }
  };

  const confirm = (planDuration, index) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content:
        "Before unstake time 25% will be deducted from your staked amount",
      okText: "Continue",
      cancelText: "Cancel",
      onOk: () => harvest(planDuration, index),
    });
  };

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div>
            <div className="row">
              <div className="col-md-12 z_upper">
                <h1 className="tkn_head ">Stake $AVENT Token + NFT</h1>
                <p className="tkn_para site_pop mt-2">
                  Your wallet: {parseFloat(tokenbalance).toFixed(2)} $AVENT
                </p>
              </div>
            </div>
            <p className="tkn_para site_pop">Choose Your Plan</p>
            <div className="row my-5 justify-content-center">
              <div className="col-md-12">
                <div className="main_apy_box d-flex justify-content-center g-2">
                  {daysMap?.map((items, index) => {
                    return (
                      <>
                        <div
                          key={index}
                          className={
                            items.days == loackableDays
                              ? "inner_apy_box  me-0 me-md-2 z_upper activeInner"
                              : "inner_apy_box  me-0 me-md-2 z_upper"
                          }
                          onClick={() => setloackableDays(items.days)}
                        >
                          <h1>{items.daysmonth} Days</h1>
                          <div
                            className={
                              items.days == loackableDays ? "activebort" : "bort "
                            }
                          >
                            <p className="apy_rate">{items.apy}% apy</p>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 z_upper">
                {/* <h1 className="wallet_nf">Your Wallet NFT Balance</h1> */}
                <p className="tkn_para site_pop">Choose Your NFT To Boost APY</p>
              </div>
            </div>
            <div className="row my-5 justify-content-center ">
              <div className="col-md-12">
                <div className="main_apy_boxxxx d-flex justify-content-center g-2">
                  {levelMap.map((items, index) => {
                    return (
                      <>
                        <div
                          className="inner_lever z_upper me-5"
                          onClick={() => setSelectlevel(items.level)}
                        >
                          <div className="d-flex align-items-center gap-1">
                            {selectlevel == items.level ? (
                              <>
                                <img
                                  src={level}
                                  className="d-none d-md-block"
                                  alt="level"
                                  width="22%"
                                />
                              </>
                            ) : (
                              <>
                                <img
                                  src={level2}
                                  className="d-none d-md-block"
                                  alt="level2"
                                />
                              </>
                            )}
                            <span className="level_num site_pop">
                              Level {items.level} = {items.mintbalance} NFT
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="text-white">
              <p
                className=" wallet_nf position-relative z_upper site_pop text-center text-white mt-2"
                style={{ color: "white !important", fontSize: "1.2rem" }}
              >
                Your reward is Boosted with {apy} Apy
              </p>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-6 z_upper">
                <div className="stk_amt">
                  <p className="site_font text-white">Stake amount</p>
                  <div className="amnt_main d-flex justify-content-between">
                    <input
                      type="text"
                      className="stk_amnt_in site_font"
                      placeholder="0"
                      name=""
                      id=""
                      value={getinputValue}
                      onChange={(e) => setGetinputValue(e.target.value)}
                    />
                    <button
                      className="max_btn site_font"
                      onClick={() =>
                        tokenbalance == 0
                          ? setGetinputValue(0)
                          : setGetinputValue(
                            parseFloat(
                              Number(tokenbalance) - Number(0.001)
                            ).toFixed(2)
                          )
                      }
                    >
                      Max
                    </button>
                  </div>
                  <p className="site_font text-white">
                    Enter amount of tokens to stake
                  </p>

                  <div className="row justify-content-center mt-4">
                    <div className="col-md-12 z_upper">
                      <button
                        style={{
                          background: "linear-gradient(45deg, #2e3192, #00ffe9)",
                        }}
                        className="lower_stake_btn btn_bg_main_web site_font"
                        onClick={stakeNFT}
                      >
                        {stakeSpinner ? "Loading..." : "Stake"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row my-5">
              <div className="col-md-6 z_upper">
                <div className="claim_card">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="content_claim_box">
                      <h1>CLAIM</h1>
                      <p className="site_font">See your claimable staking rewards here</p>
                    </div>
                    <div>
                      {/* <img src={calim} className="card_claim_pic" alt="" /> */}
                    </div>
                  </div>
                  <div className="row  mt-3 mt-md-0">
                    <div className="col-md-9">
                      <button className="claim_card_btnnnn site_font"
                        style={{ background: "linear-gradient(45deg, #2e3192, #00ffe9)" }}>
                        Unclaimed rewards: {parseFloat(totalclaimedrewards).toFixed(2)} $AVENT
                      </button>
                      <div className="d-flex gap-2 mt-2">
                        <button
                          onClick={() => window.open("https://docs.aventaproject.com/tokenomics/staking-and-rewards/claims", "_blank")}
                          className="claim_card_btn_outlined site_font"
                        >
                          Learn more
                        </button>

                        {/* <button
                    className="claim_card_btnnnn   site_font"
                    style={{background:"linear-gradient(45deg, #2e3192, #00ffe9)"}}
                    onClick={claimToken}
                  >
                    {spinnerClaim ? "Loading..." : "Claim now"}
                  </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 z_upper mt-3 mt-md-0">
                <div className="claim_card">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="content_claim_box">
                      <h1>Future Rewards</h1>
                      <p className="site_font">
                        See your future rewards here.
                      </p>
                    </div>
                    <div>
                      {/* <img src={stake} className="card_claim_pic" alt="" /> */}
                    </div>
                  </div>
                  <div className="row mt-3 mt-md-0">
                    <div className="col-md-9">
                      <button className="claim_card_btnnnn site_font"
                        style={{ background: "linear-gradient(45deg, #2e3192, #00ffe9)" }}>
                        Total Future Rewards: {parseFloat(totalfuturerewards).toFixed(2)} $AVENT
                      </button>
                      <div className="d-flex gap-2 mt-2">
                        <button onClick={() => window.open("https://docs.aventaproject.com/tokenomics/staking-and-rewards/future-rewards", "_blank")} className="claim_card_btn_outlined site_font">
                          Learn more
                        </button>
                        {/* <button className="claim_card_btn site_font">Unstake</button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row align-items-center  mt-4 justify-content-between">
              <div className="col-6 z_upper ">
                <h1 className="tskea">Your Stakes</h1>
              </div>
              <div className="col-6 z_upper text-end ">
                <div>
                  <button className="refres " onClick={Stake_History}>
                    {" "}
                    Refresh <img src={refresh} alt="" />
                  </button>
                </div>
              </div>
            </div>
            <div className="row my-5  ">
              <div className="table-responsive z_upper">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Sr.no #</th>
                      <th scope="col">Staked Amount</th>
                      <th scope="col">NFT Level</th>

                      <th scope="col">
                        Withdraw Date &Time <img src={withd} alt="" />
                      </th>
                      <th scope="col">Unstake</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Stake_History_show.length == 0 ? (
                      <>
                        <tr>
                          <td
                            className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg"
                            colSpan={5}
                            style={{ border: "none" }}
                          >
                            <div className="MuiBox-root css-ehd0rl">
                              <p className="MuiTypography-root MuiTypography-body1 css-o7q7an">
                                You have no staking data
                              </p>
                            </div>
                          </td>{" "}
                        </tr>
                        {/* <td style={{color:"red"}} className="total_ree">Total reward</td> */}
                      </>
                    ) : (
                      <>
                        {Stake_History_show.map((items, index) => {
                          let current_Time = Math.floor(
                            new Date().getTime() / 1000.0
                          );

                          return (
                            <>
                              {items.unstaked == true || items.withdrawan == true ? (
                                <></>
                              ) : (
                                <>
                                  <tr className="MuiTableRow-root css-1gqug66">
                                    <td
                                      className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg  text-center"
                                      scope="col"
                                    >
                                      {index + 1}
                                    </td>
                                    <td
                                      className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg  text-center"
                                      scope="col"
                                    >
                                      {items.amount}
                                    </td>
                                    <td
                                      className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg  text-center"
                                      scope="col"
                                    >
                                      {items?.userNFTIDsLevel}
                                    </td>
                                    <td
                                      className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg  text-center"
                                      scope="col"
                                    >
                                      <Countdown
                                        date={
                                          Date.now() +
                                          (parseInt(items?.endTime) * 1000 -
                                            Date.now())
                                        }
                                        renderer={renderer}
                                      />
                                    </td>
                                    <td
                                      className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg  text-center"
                                      scope="col"
                                    >
                                      <button
                                        className="refres"
                                        tabIndex={0}
                                        type="button"
                                        onClick={() =>
                                          current_Time >= items?.endTime
                                            ? (harvest(items.planDuration, items.index),
                                              setunStakeSpinner(index))
                                            : confirm(items.planDuration, items.index)
                                        }
                                      >
                                        {unStakeSpinner === index
                                          ? "Loading ..."
                                          : "Unstake"}

                                        <span className="MuiTouchRipple-root css-w0pj6f" />
                                      </button>
                                    </td>{" "}
                                  </tr>{" "}
                                </>
                              )}
                            </>
                          );
                        })}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>)}
    </div>
  );
}
