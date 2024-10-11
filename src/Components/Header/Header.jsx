import React, { useState } from "react";
import "./Header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../Assets/logo.jpeg";
import flag from "../Assets/flag.png";
import { AiOutlineMenu } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
// import { Link } from "react-router-dom";

export default function Header({ scrollToTokenMinting }) {
  const [show, setShow] = useState(false);
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const handleClose = () => {
    setShow(false)
  };
  return (
    <div className="main_header_here mb_top_stick">
      <Navbar collapseOnSelect expand="lg" className="mian_nav">
        <Container>
          <Navbar.Brand href="#" className="main_logo">
            <img src={logo} alt="" />
          </Navbar.Brand>
          <div className="d-flex gap-1 align-items-center">
            <button
              className="header_btn_ora site_pop d-block d-lg-none"
              onClick={() =>
                !!address
                  ? chain?.id == chains[0]?.id
                    ? open()
                    : switchNetwork?.(chains[0]?.id)
                  : open()
              }
            >
              {!!address ? (
                chain?.id == chains[0]?.id || chain?.id == chains[1]?.id ? (
                  address ? (
                    <>
                      {`${address.substring(0, 6)}...${address.substring(
                        address.length - 4
                      )}`}
                    </>
                  ) : (
                    <>Connect wallet</>
                  )
                ) : (
                  "Switch"
                )
              ) : (
                <>Connect wallet</>
              )}{" "}
            </button>
            <span className="d-block d-lg-none" onClick={() => setShow(!show)}>
              {show ? (
                <>
                  <RxCross2 className="text-white fs-1" />{" "}
                </>
              ) : (
                <>
                  <AiOutlineMenu className="text-white fs-1" />
                </>
              )}
            </span>
          </div>
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className={show ? "show" : ""}
          >
            <Nav className="ms-auto">
              <Nav.Link
                className="apy"
                href="#features"
                onClick={handleClose}
                style={{ color: "#AA00B8" }}
              >
                Home <i class="fa-solid fa-house"></i>
              </Nav.Link>

              <Nav.Link
                href="https://docs.aventaproject.com"
                target="_blank"
                onClick={handleClose}
              >
                Whitepaper <i class="fa-solid fa-book"></i>
              </Nav.Link>
              <Nav.Link href="https://docs.aventaproject.com/utilities-and-features/multi-blockchain-utilities" target="_blank" onClick={handleClose}>
                Utilities <i class="fa-solid fa-bolt"></i>
              </Nav.Link>

              <Nav.Link
                href="https://t.me/AventaProject"
                target="_blank"
                onClick={handleClose}
              >
                Telegram <i class="fa-brands fa-telegram"></i>
              </Nav.Link>
              <Nav.Link href="https://aventaproject.com" target="_blank" onClick={handleClose}>
                Website <i class="fa-solid fa-globe"></i>
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <div className="d-flex flex-column flex-lg-row gap-2 align-items-center">
                <button
                  className="outline_btn_ora site_pop"
                  onClick={() => {
                    handleClose();
                    scrollToTokenMinting()
                  }}
                >
                  Mint NFTs
                </button>
                <button
                  className="header_btn_ora d-none d-lg-block site_pop"
                  onClick={() =>
                    address
                      ? chain?.id == chains[0]?.id
                        ? open()
                        : switchNetwork?.(chains[0]?.id)
                      : open()
                  }
                >
                  {address ? (
                    chain?.id == chains[0]?.id || chain?.id == chains[1]?.id ? (
                      address ? (
                        <>
                          {`${address.substring(0, 6)}...${address.substring(
                            address.length - 4
                          )}`}
                        </>
                      ) : (
                        <>Connect wallet</>
                      )
                    ) : (
                      "Switch"
                    )
                  ) : (
                    <>Connect wallet</>
                  )}{" "}
                </button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
