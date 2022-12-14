import styled from "styled-components";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import Container from "./Container";
import { padWidth } from "../utils";

import Mint from '../components/Mint';

import Image from 'next/image'
import bgimg from '../public/images/bgimg.jpeg'

const Head = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  font-size: 40px;
  font-weight: bold;
  @media only screen and (max-width: ${padWidth}) {
    flex-direction: column;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

function Intro() {
  return (
    <Container
      style={{
        backgroundImage: `url(${bgimg.src})`,
        backgroundSize: 'cover',
        // backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
      id="intro"
    >
      <Head>
        <h1> X-Dragon </h1>
      </Head>
      {/* <Typography>π°πππππππππ πππ ππ ππππ ππ πππ ππππ ππππππ</Typography> */}
      {/* <Typography>ππππ ππ ππππ πΎπππππππ π°πππππ πππππ ππ πππ πππππ ππ πππ, ππππππ ππ πππππ</Typography> */}
      <Content>

        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "raw",
            alignItems: "center",
          }}
        >
          <Tooltip title="OpenSea">
            <a
              href="https://opensea.io/collection/x-dragon"
              target="_blank"
              rel="noreferrer"
            >
              <img
                style={{
                  cursor: "pointer",
                  width: 40,
                  marginRight: "20px",
                  marginLeft: "20px"
                }}
                src="/icons/opensea.svg"
              />
            </a>
          </Tooltip>
          <Tooltip title="Twitter">
            <a
              href="https://twitter.com/Xxxenft"
              target="_blank"
              rel="noreferrer"
            >
              <img
                style={{
                  cursor: "pointer",
                  width: 40,
                  marginRight: "20px",
                  marginLeft: "20px"
                }}
                src="/icons/twitter.svg"
              />
            </a>
          </Tooltip>
          {/* <Tooltip title="ε?ζΉ LooksRare">
            <a
              href="https://looksrare.org/collections/0x2C574112d75Fb6092dd1256ACeb51B7685eDE789"
              target="_blank"
              rel="noreferrer"
            >
              <img
                style={{
                  cursor: "pointer",
                  width: 40,
                  marginRight: "40px",
                }}
                src="/icons/looksrare.png"
              />
            </a>
          </Tooltip>
          <Tooltip title="ε?ζΉ X2Y2">
            <a
              href="https://x2y2.io/collection/jiqimao"
              target="_blank"
              rel="noreferrer"
            >
              <img
                style={{
                  cursor: "pointer",
                  width: 40,
                  marginRight: "40px",
                }}
                src="/icons/x2y2.svg"
              />
            </a>
          </Tooltip> */}
          {/* <Tooltip title="ε?ζΉ Gem">
            <a
              href="https://www.gem.xyz/collection/jiqimao"
              target="_blank"
              rel="noreferrer"
            >
              <img
                style={{
                  cursor: "pointer",
                  width: 40,
                  marginRight: "40px",
                }}
                src="/icons/gem.jpeg"
              />
            </a>
          </Tooltip> */}
        </div>
        <Mint />
      </Content>
    </Container>
  );
}

export default Intro;
