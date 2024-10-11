import React from "react";
import "./How_mk_works.css";
import hmk1 from "../Assets/hmk1.svg";
import hmk2 from "../Assets/hmk2.svg";
import hmk3 from "../Assets/hmk3.svg";

export default function How_mk_works() {
  return (
    <div className="how_mk_mian">
      <div className="container">
        <h1 className="hmkw">HOW STAKING $AVENT WORKS</h1>
        <div className="row steps_row">
          <div className="col-md-4 lines_sys">
            <div className="how_mk_wo text-center">
              <h6 className="site_pop">Step 1</h6>
              {/* <img src={hmk1} alt="" /> */}
              <svg
                width="121"
                height="120"
                viewBox="0 0 121 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2.5"
                  y="2"
                  width="116"
                  height="116"
                  rx="58"
                  stroke="#00ffe9"
                  stroke-width="4"
                />
                <path
                  d="M49.75 50C45.5472 50 41.4387 51.2463 37.9441 53.5813C34.4496 55.9163 31.7259 59.235 30.1176 63.118C28.5092 67.0009 28.0884 71.2736 28.9083 75.3957C29.7283 79.5178 31.7521 83.3042 34.724 86.276C37.6959 89.2479 41.4822 91.2718 45.6043 92.0917C49.7264 92.9116 53.9991 92.4908 57.882 90.8824C61.765 89.2741 65.0838 86.5504 67.4187 83.0559C69.7537 79.5613 71 75.4529 71 71.25C71 65.6141 68.7612 60.2091 64.776 56.224C60.7909 52.2388 55.3859 50 49.75 50ZM49.75 90C46.0416 90 42.4165 88.9003 39.3331 86.8401C36.2496 84.7798 33.8464 81.8514 32.4273 78.4253C31.0081 74.9992 30.6368 71.2292 31.3603 67.5921C32.0838 63.9549 33.8695 60.614 36.4918 57.9917C39.114 55.3695 42.4549 53.5837 46.0921 52.8603C49.7292 52.1368 53.4992 52.5081 56.9253 53.9273C60.3514 55.3464 63.2798 57.7496 65.3401 60.8331C67.4003 63.9165 68.5 67.5416 68.5 71.25C68.5 76.2228 66.5246 80.9919 63.0083 84.5083C59.492 88.0246 54.7228 90 49.75 90Z"
                  fill="#00ffe9"
                />
                <path
                  d="M60.375 64.3751L50.375 58.6063C50.185 58.4966 49.9694 58.4388 49.75 58.4388C49.5306 58.4388 49.315 58.4966 49.125 58.6063L39.125 64.3751C38.9352 64.4847 38.7775 64.6423 38.6678 64.832C38.5581 65.0218 38.5002 65.2371 38.5 65.4563V77.0126C38.4946 77.237 38.5499 77.4588 38.6598 77.6546C38.7698 77.8503 38.9305 78.0129 39.125 78.1251L49.125 83.9001C49.315 84.0098 49.5306 84.0675 49.75 84.0675C49.9694 84.0675 50.185 84.0098 50.375 83.9001L60.375 78.1251C60.5648 78.0155 60.7225 77.8579 60.8322 77.6681C60.9419 77.4783 60.9998 77.263 61 77.0438V65.4626C61.0009 65.2423 60.9435 65.0257 60.8338 64.8347C60.724 64.6438 60.5657 64.4852 60.375 64.3751ZM49.75 61.1251L57.4437 65.5688L49.75 70.0001L42.0562 65.5751L49.75 61.1251ZM41 67.8563L48.5 72.1876V80.6251L41 76.2876V67.8563ZM51 80.6251V72.1876L58.5 67.8563V76.2876L51 80.6251Z"
                  fill="#00ffe9"
                />
                <path
                  d="M69.75 30C57.8313 30 48.5 34.375 48.5 40V46.25C48.5 46.5815 48.6317 46.8995 48.8661 47.1339C49.1005 47.3683 49.4185 47.5 49.75 47.5C50.0815 47.5 50.3995 47.3683 50.6339 47.1339C50.8683 46.8995 51 46.5815 51 46.25V44.775C54.55 47.9 61.5375 50 69.75 50C77.9625 50 84.95 47.9125 88.5 44.775V56.3875C88.5 59.0875 83.5 62.4875 73.9625 63.7625C73.6505 63.8068 73.3668 63.9674 73.1681 64.2119C72.9694 64.4565 72.8705 64.7671 72.891 65.0816C72.9115 65.396 73.0501 65.6911 73.2789 65.9077C73.5077 66.1244 73.8099 66.2466 74.125 66.25H74.2875C80.7875 65.3875 85.7313 63.5625 88.5 61.1563V72.5688C88.5 75.525 82.8375 79.075 73.3688 79.8875C73.0372 79.9016 72.7249 80.0468 72.5004 80.2912C72.276 80.5356 72.1578 80.8591 72.1719 81.1906C72.186 81.5221 72.3312 81.8345 72.5756 82.059C72.8199 82.2834 73.1435 82.4016 73.475 82.3875H73.5812C83.8375 81.4938 91 77.4625 91 72.5688V40C91 34.375 81.6688 30 69.75 30ZM69.75 47.5C58.7 47.5 51 43.55 51 40C51 36.45 58.7 32.5 69.75 32.5C80.8 32.5 88.5 36.45 88.5 40C88.5 43.55 80.8 47.5 69.75 47.5Z"
                  fill="#00ffe9"
                />
              </svg>
              <h1>Stake $AVENT</h1>
              <p className="site_pop">Earn daily staking rewards</p>
            </div>
            <div className="side_line d-none d-md-block"></div>
          </div>
          <div className="col-md-4 lines_sys">
            <div className="how_mk_wo text-center">
              <h6 className="site_pop">Step 2</h6>
              <img src={hmk2} alt="" />
              <h1>Mint NFTs</h1>
              <p className="site_pop">Mint NFTs and Stake With Boosted Rewards</p>
            </div>
            <div
              className="side_line d-none d-md-block"
              style={{ background: "#ffffff" }}
            ></div>
          </div>
          <div className="col-md-4 lines_sys">
            <div className="how_mk_wo text-center">
              <h6 className="site_pop">Step 3</h6>
              <img src={hmk3} alt="" />
              <h1>EARN AND CLAIM REWARDS</h1>
              <p className="site_pop">Claim Your reward at Anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}