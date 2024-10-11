import React from "react";
import "./Footer.css";
import logo from "../Assets/logo.jpeg";
import fs from "../Assets/fs.svg";
import fs1 from "../Assets/fs1.svg";
import fs2 from "../Assets/fs2.svg";
import fs3 from "../Assets/facebook.svg";
import fs4 from "../Assets/instagram.svg";
import fs5 from "../Assets/linkedin.svg";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaTelegramPlane, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


export default function Footer() {
  return (
    <div className="main_footer">
      <div className="container">
        <div className="row align-items-baseline">
          <div className="col-md-8">
            <div className=" d-flex flex-column flex-lg-row gap-5">
              <div>
                <img src={logo} className="footer_logo" alt="" />
              </div>
            
            </div>
            <p className="pleft_f site_font">
            Mint NFTs using Aventa tokens and participate in our staking pool, which offers three different plans. Staking with your NFTs will earn you a booster in your APY, providing additional rewards based on your NFT ownership.
            </p>
          </div>
          <div className="col-md-4">
            <h1 className="cum">JOIN THE COMMUNITY</h1>
           
            <p className="ada site_font">
              Join us now and stay connected with exclusive content and
              updates in our communities!
            </p>
            <div className="d-flex gap-3">
            {/* <FaTelegramPlane className="main_footer_icons" /> */}
            <a href="https://t.me/AventaProject" target="_blank">  <FaTelegramPlane className="main_footer_icons"></FaTelegramPlane></a>
              {/* <FaYoutube className="main_footer_icons" /> */}
             
              <a href="https://x.com/AventaProject" target="_blank">  <FaXTwitter className="main_footer_icons"></FaXTwitter></a>
            </div>
          </div>
        </div>
      </div>
      <div className="lower_foss">
        <div className="container">
          <div className="row justify-content-center">
          
            <div className="col-md-4 mt-3 mt-md-0  sklaa">
              <div className="lowerse">
                <a href="">© Copyright 2024 - $AVENT</a>
              </div>
            </div>
         
          </div>
        </div>
      </div>
    </div>
  );
}
