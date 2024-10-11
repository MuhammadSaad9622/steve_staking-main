import React, { useEffect, useState } from "react";
import "./Nft_token_tab.css";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NFT_miniting from "../NFT_miniting/NFT_miniting";
import calim from "../Assets/claim_card.jpeg";
import stake from "../Assets/totalsection.jpeg";
import refresh from "../Assets/refresh.png";
import withd from "../Assets/withdraw.png";
import level from "../Assets/level.png";
import level2 from "../Assets/level2.svg";
import Web3 from "web3";

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
  Egg_token_Staking_Contract_ABI,
  Egg_token_Staking_Contract_Address,
} from "../../Contract/Contract";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import NFTStaking from "./NFTStaking";
import moment from "moment";
import Countdown from "react-countdown";
import NFTStakings from "./NFTStaking";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { Modal, Space } from "antd";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const daysMap = [
  {
    daysmonth: 14,
    days: 14,
    apy: 0.41
  },
  {
    daysmonth: 30,
    days: 30,
    apy: 1.66,
  },
  {
    daysmonth: 60,
    days: 60,
    apy: 5,
  },
  {
    daysmonth: 90,
    days: 90,
    apy: 12.5,
  },

];

const levelMap = [
  {
    level: 1,
    nft: 3,
  },
  {
    level: 2,
    nft: 3,
  },
  {
    level: 3,
    nft: 3,
  },
];

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Nft_token_tab({ activeTab, setActiveTab }) {
  const [value, setValue] = React.useState(activeTab || 0);

  useEffect(() => {
    setValue(activeTab);
  }, [activeTab])
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setActiveTab(newValue);
  };
  const { address } = useAccount();
  const [mintbalance1, setMintbalance1] = useState(0);
  const [mintbalance2, setMintbalance2] = useState(0);
  const [mintbalance3, setMintbalance3] = useState(0);
  const [tokenbalance, setTokenbalance] = useState(0);
  const [loackableDays, setloackableDays] = useState(14);
  const [selectlevel, setSelectlevel] = useState(1);
  const [getinputValue, setGetinputValue] = useState("");
  const [stakeSpinner, setStakeSpinner] = useState(false);
  const [Stake_History_show, setStake_History_show] = useState([]);
  const [showpendindRewards, setShowPendingRewards] = useState(0);
  const [unclaimedRewards, setUnclaimedRewards] = useState(0);
  const [spinnerClaim, setspinnerClaim] = useState(false);
  const [futureRewards, setFutureRewards] = useState(0);
  const [stakedPlans, setStakedPlans] = useState([]);
  const [stakesCount, setStakesCount] = useState([]);
  const [userDepositInfo, setUserDepositInfo] = useState([]);

  const webSupply = new Web3("wss://ethereum-rpc.publicnode.com");

  useEffect(() => {
    if (address) {
      checkMintBalance();
    }
  }, [address, userDepositInfo, stakedPlans]);

  const checkMintBalance = async () => {
    try {
      const [mintBalance1, mintBalance2, mintBalance3] = await Promise.all([
        getMintBalance(0),
        getMintBalance(1),
        getMintBalance(2)
      ]);

      setMintbalance1(mintBalance1);
      setMintbalance2(mintBalance2);
      setMintbalance3(mintBalance3);

      const tokenBalance = await getTokenBalance();
      setTokenbalance(tokenBalance);

      const pendingRewards = await calculatePendingRewards();
      setShowPendingRewards(parseFloat(pendingRewards).toFixed(6) || '0.000000');

      const { futureReward, claimedAmount } = await calculateFutureAndClaimedRewards();
      setFutureRewards(futureReward);
      setUnclaimedRewards(claimedAmount ? claimedAmount : 0);
    } catch (error) {
      console.error('Error in checkMintBalance:', error);
    }
  };

  const getMintBalance = async (index) => {
    const contractOf = new webSupply.eth.Contract(
      mint_Contract_ABI[index],
      mint_Contract_Address[index]
    );
    return await contractOf.methods.balanceOf(address).call();
  };

  const getTokenBalance = async () => {
    const contractOftoken = new webSupply.eth.Contract(
      Egg_token_Contract_ABI,
      Egg_token_Contract_Address
    );
    return await contractOftoken.methods.balanceOf(address).call();
  };

  const calculatePendingRewards = async () => {
    if (userDepositInfo.length === 0) return 0;

    const contractOfStaking = new webSupply.eth.Contract(
      Egg_token_Staking_Contract_ABI,
      Egg_token_Staking_Contract_Address
    );

    const rewards = await Promise.all(
      userDepositInfo.map(async (data) => {
        const userDividends = await contractOfStaking.methods
          .getUserDividends(address, Number(data.plan), Number(data.index))
          .call();
        return Number(userDividends) < 0 ? 0 : Number(userDividends) / 1e18;
      })
    );

    return rewards.reduce((acc, curr) => acc + curr, 0);
  };

  const calculateFutureAndClaimedRewards = async () => {
    const contractOfStaking = new webSupply.eth.Contract(
      Egg_token_Staking_Contract_ABI,
      Egg_token_Staking_Contract_Address
    );

    const futureAndClaimedRewards = await Promise.all(
      stakedPlans.map(async (plan) => {
        const number = await contractOfStaking.methods
          .futureRewards(address, plan)
          .call();
        return {
          futureReward: Number(number.reward) / 1e18,
          claimedAmount: Number(number.claimedAmount) / 1e18
        };
      })
    );

    const totals = futureAndClaimedRewards.reduce(
      (acc, curr) => ({
        futureReward: acc.futureReward + curr.futureReward,
        claimedAmount: acc.claimedAmount + curr.claimedAmount
      }),
      { futureReward: 0, claimedAmount: 0 }
    );

    return totals;
  };


  const stakeToken = async () => {
    try {
      if (!address) {
        toast.error("Connect Wallet First!");
        setStakeSpinner(false);
        return
      }
      if (getinputValue !== "") {
        // let valueToken = webSupply.utils.toWei(getinputValue.toString());

        let valueToken = Number(getinputValue) * Number(1000000000000000000);

        let amounts = valueToken.toLocaleString("fullwide", {
          useGrouping: false,
        });
        let amounts1 = parseInt(amounts);
        valueToken = amounts1.toLocaleString("fullwide", {
          useGrouping: false,
        });
        console.log(valueToken, "valueToken");
        setStakeSpinner(true);
        const { request } = await prepareWriteContract({
          address: Egg_token_Contract_Address,
          abi: Egg_token_Contract_ABI,
          functionName: "approve",
          args: [Egg_token_Staking_Contract_Address, valueToken.toString()],
          account: address,
        });
        const { hash } = await writeContract(request);
        const data = await waitForTransaction({
          hash,
        });
        toast.success("Transaction Completed");
        setTimeout(async () => {
          setStakeSpinner(true);
          const { request } = await prepareWriteContract({
            address: Egg_token_Staking_Contract_Address,
            abi: Egg_token_Staking_Contract_ABI,
            functionName: "farm",
            args: [valueToken.toString(), loackableDays],
            account: address,
          });
          const { hash } = await writeContract(request);
          const data = await waitForTransaction({
            hash,
          });
          toast.success("Transaction Completed");
          setStakeSpinner(false);
        }, 3000);
      } else {
        toast.error("Please enter Token value First!");
        setStakeSpinner(false);
      }

    } catch (error) {
      setStakeSpinner(false);
      console.log(error);
    }
  };

  const Stake_History = async () => {
    if (!address) {
      toast.error("Connect Wallet First to View History!");
      return;
    }
    try {
      let stakingContractOf = new webSupply.eth.Contract(
        Egg_token_Staking_Contract_ABI,
        Egg_token_Staking_Contract_Address
      );
      const userStakedPlans = await stakingContractOf.methods.getUserStakedPlans(address).call();
      setStakedPlans(userStakedPlans)
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
      setUserDepositInfo(userDepositInfo)
      setStake_History_show(userDepositInfo);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {

    Stake_History();
  }, [address]);

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

  const harvest = async (index, plan) => {
    try {
      if (address) {
        // let planDuration = Number(plan)
        // planDuration = planDuration.toString()

        console.log(plan, "<<<<<<<<")

        const { request } = await prepareWriteContract({
          address: Egg_token_Staking_Contract_Address,
          abi: Egg_token_Staking_Contract_ABI,
          functionName: "harvest",
          args: [plan, index],
          account: address,
        });
        const { hash } = await writeContract(request);
        const data = await waitForTransaction({
          hash,
        });
        Stake_History()
        toast.success("Transaction Completed");
      } else {
        toast.error("Connect Wallet First!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const claimToken = async (index) => {
    try {
      if (address) {
        setspinnerClaim(true);
        const { request } = await prepareWriteContract({
          address: Egg_token_Staking_Contract_Address,
          abi: Egg_token_Staking_Contract_ABI,
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

  const confirm = (index, plan) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content:
        "Before unstake time 25% will be deducted from your staked amount",
      okText: "Continue",
      cancelText: "Cancel",
      onOk: () => harvest(index, plan),
    });
  };
  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="fullWidth"
            TabIndicatorProps={{
              sx: {
                background: "linear-gradient(35deg, rgb(46, 49, 146), rgb(0, 255, 233))", // Gradient for the indicator
                height: 4,
              },
            }}
            sx={{
              "@media only screen and (max-width:600px)": {
                "& .MuiTabs-scroller": {
                  overflowX: "scroll",
                  width: "100%",
                },
              },
            }}
          >
            <Tab
              label="NFT Staking"
              {...a11yProps(0)}
              sx={{
                minWidth: "auto",
                color: "#ffff",
                background: value === 0 ? "linear-gradient(90deg, #00FFFF 0%, #00FF80 100%)" : "transparent", // Solid dark background for the active tab
                borderRadius: "25px",
                padding: "10px 20px",
                margin: "0 5px",
              }}
            />
            <Tab
              label="NFT Minting"
              {...a11yProps(1)}
              sx={{
                minWidth: "auto",
                color: "#ffff", // White for active tab, yellow for inactive
                background: value === 1 ? "linear-gradient(90deg, #00FFFF 0%, #00FF80 100%)" : "transparent", // Solid dark background for active tab
                borderRadius: "25px",
                padding: "10px 20px",
                margin: "0 5px",
              }}
            />
            <Tab
              label="Token Staking"
              {...a11yProps(2)}
              sx={{
                minWidth: "auto",
                color: "#ffff", // White for active tab, yellow for inactive
                background: value === 2 ? "linear-gradient(90deg, #00FFFF 0%, #00FF80 100%)" : "transparent", // Solid dark background for active tab
                borderRadius: "25px",
                padding: "10px 20px",
                margin: "0 5px",
              }}
            />
          </Tabs>
        </Box>



        <CustomTabPanel value={value} index={2}>
          <div className="row">
            <div className="col-md-12 z_upper">
              <h1 className="tkn_head ">Stake $AVENT Token</h1>
              <p className="tkn_para site_pop mt-2">
                Your wallet:{" "}
                {parseFloat(
                  Number(tokenbalance) / Number(1000000000000000000)
                ).toFixed(2)}{" "}
                $AVENT
              </p>
            </div>
          </div>
          <p className="tkn_para site_pop">Choose Your Plan</p>
          <div className="row my-5 mx-0 ">
            <div className="col-md-12">
              <div className="main_apy_box d-flex justify-content-center">
                {daysMap?.map((items, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className={
                          items.days == loackableDays
                            ? "inner_apy_box me-2 me-md-2 z_upper  activeInner"
                            : "inner_apy_box   me-2 me-md-2 z_upper"
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

          <div className="row justify-content-center">
            <div className="col-md-6 z_upper">
              <div className="stk_amt">
                <p className="site_font">Stake amount</p>
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
                            Number(
                              Number(tokenbalance) /
                              Number(1000000000000000000)
                            ) - Number(0.001)
                          ).toFixed(2)
                        )
                    }
                  >
                    Max
                  </button>
                </div>
                <p className="site_font">Enter amount of tokens to stake</p>

                <div className="row justify-content-center mt-4">
                  <div className="col-md-12 z_upper">
                    <button
                      className="lower_stake_btn site_font"
                      onClick={stakeToken}

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
                    <p className="site_font">See your Claimed staking rewards here</p>
                  </div>
                  <div>
                    {/* <img src={calim} className="card_claim_piccc" alt="" /> */}
                  </div>
                </div>
                <div className="row  mt-3 mt-md-0">
                  <div className="col-md-9">
                    <button className="claim_card_btnnnn site_font"
                      style={{ background: "linear-gradient(45deg, #2e3192, #00ffe9)" }}>
                      Claimed rewards:{" "}{parseFloat(unclaimedRewards).toFixed(2)} $AVENT
                    </button>
                    <div className="d-flex gap-2 mt-2">
                      <button
                        onClick={() => window.open("https://docs.aventaproject.com/tokenomics/staking-and-rewards/claims", "_blank")}
                        className="claim_card_btn_outlined site_font"
                      >
                        Learn more
                      </button>

                      {/* <button

                        className="claim_card_btnnnn site_font"
                        onClick={claimToken}
                        style={{background:"linear-gradient(45deg, #2e3192, #00ffe9)"}}
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
                    <p className="content_claim_box">
                      See your future rewards here.
                    </p>
                  </div>
                  <div>
                    {/* <img src={stake} className="card_claim_pic" alt="" /> */}
                  </div>
                </div>
                <div className="row mt-3 mt-md-0">
                  <div className="col-md-9">
                    <button className="claim_card_btnnnn  site_font"
                      style={{ background: "linear-gradient(45deg, #2e3192, #00ffe9)" }}>
                      Total Future Rewards: {parseFloat(futureRewards).toFixed(2)} $AVENT
                    </button>
                    <div className="d-flex gap-2 mt-2">
                      <button
                        onClick={() => window.open("https://docs.aventaproject.com/tokenomics/staking-and-rewards/future-rewards", "_blank")}
                        className="claim_card_btn_outlined site_font">
                        Learn more
                      </button>
                      {/* <button className="claim_card_btn site_font">
                        Unstake
                      </button> */}
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
                <button className="refres" onClick={Stake_History}>
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
                                <Countdown
                                  date={
                                    Date.now() +
                                    (parseInt(items.end) * 1000 -
                                      Date.now())
                                  }
                                  renderer={renderer}
                                />
                              </td>
                              <td
                                className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg  text-center"
                                scope="col"
                              >
                                {items.hasHarvested ? <button
                                  className="refres"
                                  tabIndex={0}
                                  type="button"
                                  disabled
                                  sx={{ cursor: "not-allowed" }}
                                >
                                  Harvested
                                  <span className="MuiTouchRipple-root css-w0pj6f" />
                                </button> : <button
                                  className="refres"
                                  tabIndex={0}
                                  type="button"
                                  onClick={() =>
                                    current_Time >= items.end
                                      ? harvest(items.index, items.plan)
                                      : confirm(items.index, items.plan)
                                  }
                                >
                                  {/* {
                                        spinner ?
                                        "Loading ...":"Unstake"
                                      } */}
                                  Unstake
                                  <span className="MuiTouchRipple-root css-w0pj6f" />
                                </button>}
                              </td>{" "}
                            </tr>{" "}
                          </>
                        );
                      })}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={0}>
          <NFTStakings
            levelMap={levelMap}
            mintbalance1={mintbalance1}
            daysMap={daysMap}
            value={value}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <NFT_miniting />
        </CustomTabPanel>
      </Box>
    </div>
  );
}
