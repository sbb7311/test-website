import { useState, useEffect } from "react";
import styled from "styled-components";
import { BigNumber, ethers } from "ethers";
import Typography from "@mui/material/Typography";
import { throttle } from "lodash";

import { get, subscribe } from "../store";
import Container from "./Container";
import ConnectWallet, { connectWallet } from "./ConnectWallet";
import showMessage from "./showMessage";
import { padWidth } from "../utils";

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

const ETHERSCAN_DOMAIN =
  process.env.NEXT_PUBLIC_CHAIN_ID === "1"
    ? "etherscan.io"
    : "goerli.etherscan.io";

const Content = styled.div`
  max-width: 840px;
  margin: 0 auto 5% auto;
  strong {
    color: red;
  }
`;

const StyledMintButton = styled.div`
  display: inline-block;
  width: 140px;
  text-align: center;
  padding: 10px 10px;
  margin-top: 30px;
  margin-bottom: 20px;
  border: 4px solid #000;
  border-radius: 10px;
  color: #000;
  background: #dde4b6;
  cursor: ${(props) => {
    return props.minting || props.disabled ? "not-allowed" : "pointer";
  }};
  opacity: ${(props) => {
    return props.minting || props.disabled ? 0.6 : 1;
  }};
`;

const MintBtnWrapper = styled.div`
display: flex;
justify-content: space-between;
@media only screen and (max-width: ${padWidth}) {
  flex-direction: column;
  align-items: center;
}
`;

function MintButton(props) {
  const [minting, setMinting] = useState(false);

  return (
    <StyledMintButton
      disabled={!!props.disabled}
      minting={minting}
      onClick={async () => {
        if (minting || props.disabled) {
          return;
        }
        setMinting(true);
        try {
          const { signer, tokencontract, contract } = await connectWallet();
          const contractWithSigner = contract.connect(signer);
		  const tokencontractWithSigner = tokencontract.connect(signer);
          const fullAddressInStore = get("fullAddress") || null;
          const numberMinted = await contract.numberMintedForPublic(fullAddressInStore);
          console.log('here: ', numberMinted);
          const mintedInStore = parseInt(numberMinted);
          const maxFreeSupply = await contract.maxFreeSupply();
          const freeMinted = await contract.freeMinted();

          let freeAmount = 0;
          //if (mintedInStore == 0 && (freeMinted + 1 <= maxFreeSupply)) {
          //  freeAmount = 1;
          //}
          
          const fixedPrice = 6000000000000;
          const fixedQuantity = props.mintAmount - freeAmount;
          const fixedValue = fixedQuantity * fixedPrice;
		  const balance = await tokencontract.balanceOf(signer.getAddress());
		  if (balance >= fixedValue){
			  let allowed = await tokencontractWithSigner.allowance(signer.getAddress(), process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
			  if (fixedValue > allowed){
				const approvetx = await tokencontractWithSigner.approve(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, fixedValue - allowed);
				const approveresponse = await approvetx.wait();
			  }
			  alert(fixedValue);
			  const tx = await contractWithSigner.mintNFT(props.mintAmount);
			  const response = await tx.wait();
			  showMessage({
				type: "success",
				title: "Mint Successfully!",
				body: (
				  <div>
					<a
					  href={`https://${ETHERSCAN_DOMAIN}/tx/${response.transactionHash}`}
					  target="_blank"
					  rel="noreferrer"
					>
					  Click for transaction details
					</a>{" "}
					or{" "}
					<a
					  href="https://opensea.io/account"
					  target="_blank"
					  rel="noreferrer"
					>
					  Direct to Opensea for details
					</a>
					。
				  </div>
				),
			  });
		  }
		  else{
			  showMessage({
				type: "error",
				title: "Mint Failed!",
				body: "insufficient funds",
			  });		  
		  }
        } catch (err) {
          showMessage({
            type: "error",
            title: "Mint Failed!",
            body: err.message,
          });
        }
        props.onMinted && props.onMinted();
        setMinting(false);
      }}
	  
      style={{
        background: "#dde4b6",
        ...props.style,
      }}
    >
      Mint {props.mintAmount} XDT {minting ? "..." : ""}
    </StyledMintButton>
  );
}

function MintSection() {
  const [status, setStatus] = useState("0");
  const [progress, setProgress] = useState(null);
  const [fullAddress, setFullAddress] = useState(null);
  const [numberMinted, setNumberMinted] = useState(0);
  const [mintAmount, setMintAmount] = useState(1);

  async function updateStatus() {
    const { contract } = await connectWallet();
    const status = await contract.status();
	const progress = parseInt(await contract.totalSupply());
    setStatus(status.toString());
    setProgress(progress);
    // 在 mint 事件的时候更新数据
    const onMint = throttle(async () => {
      const status = await contract.status();
      const progress = parseInt(await contract.totalSupply());
      setStatus(status.toString());
      setProgress(progress);
    }, 1000 - 233);
    contract.on("Minted", onMint);
  }

  useEffect(() => {
    (async () => {
      const fullAddressInStore = get("fullAddress") || null;
      if (fullAddressInStore) {
        const { contract } = await connectWallet();
        const numberMinted = await contract.numberMintedForPublic(fullAddressInStore);
        setNumberMinted(parseInt(numberMinted));
        setFullAddress(fullAddressInStore);
      }
      subscribe("fullAddress", async () => {
        const fullAddressInStore = get("fullAddress") || null;
        setFullAddress(fullAddressInStore);
        if (fullAddressInStore) {
          const { contract } = await connectWallet();
          const numberMinted = await contract.numberMintedForPublic(fullAddressInStore);
          setNumberMinted(parseInt(numberMinted));
          updateStatus();
        }
      });
    })();
  }, []);

  useEffect(() => {
    try {
      const fullAddressInStore = get("fullAddress") || null;
      if (fullAddressInStore) {
        updateStatus();
      }
    } catch (err) {
      showMessage({
        type: "error",
        title: "Call Failed!",
        body: err.message,
      });
    }
  }, []);

  async function refreshStatus() {
    const { contract } = await connectWallet();
    const numberMinted = await contract.numberMintedForPublic(fullAddress);
    setNumberMinted(parseInt(numberMinted));
  }

  let mintButton = (
    <StyledMintButton
      style={{
        background: "#eee",
        color: "#999",
        cursor: "not-allowed",
      }}
    >
      Not Started
    </StyledMintButton>
  );

  if (status === "1") {
    mintButton = (
      <MintBtnWrapper>
        <MintButton
          onMinted={refreshStatus}
          mintAmount={mintAmount}
        />
        </MintBtnWrapper>
    );
  }

  if (progress >= 2222 || status === "2") {
    mintButton = (
      <StyledMintButton
        style={{
          background: "#eee",
          color: "#999",
          cursor: "not-allowed",
        }}
      >
        Sold Out
      </StyledMintButton>
    );
  }

  // if (numberMinted + progress >= 2222) {
  //   mintButton = (
  //     <StyledMintButton
  //       style={{
  //         background: "#eee",
  //         color: "#999",
  //         cursor: "not-allowed",
  //       }}
  //     >
  //       Exceed Max Supply
  //     </StyledMintButton>
  //   );
  // }

  if (!fullAddress) {
    mintButton = (
      <StyledMintButton
        style={{
          background: "#eee",
          color: "#999",
          cursor: "not-allowed",
        }}
      >
        Connect Wallet
      </StyledMintButton>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ marginBottom: 10, display: "flex", alignItems: "center" }}>
        Your Wallet： <ConnectWallet />{" "}
        {fullAddress && numberMinted == 0 && (
          <span style={{ marginLeft: 10 }}>
            {/* you can mint  {1 - numberMinted} xdt for free */}
          </span>
        )}
      </div>

      <div style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "raw",
            alignItems: "center",
        }}>

<ButtonGroup variant="contained" aria-label="outlined primary button group"  size="large">
      <Button onClick={() => {
        let tempAmount = mintAmount;
        if (tempAmount > 1) {
          tempAmount--;
          setMintAmount(tempAmount);
        }
      }}
      > - </Button>
      <Button> {mintAmount} </Button>
      <Button onClick={() => {
          let temp = mintAmount;
          temp++;
          setMintAmount(temp);
      }}
      > + </Button>
    </ButtonGroup>

      </div>

      {mintButton}

      <div style={{ marginTop: 10, fontSize: 50, textAlign: "center" }}>
        <Typography style={{marginBottom: 10}}>
        MINT STATUS: {progress === null ? "connect wallet" : progress} / 6666
        </Typography>
        <Typography style={{marginBottom: 10}}>
        0.0006 xen per item on sale
        </Typography>
      </div>

      <div style={{ marginTop: 150 }}>
        {/* 请移步在{" "}
        <a
          href="https://opensea.io/collection/"
          target="_blank"
          rel="noreferrer"
        >
          OpenSea
        </a>{" "}
        上查看。 */}
      </div>

      
    </div>
  );
}

function Mint() {
  return (
    <Container
      style={{
        // background: "#dae7f8",
        color: "#ffffff",
      }}
      id="mint"
    >

      <Content>
        <div
          style={{
            marginTop: 40,
          }}
        >
          <MintSection />
        </div>
      </Content>
    </Container>
  );
}

export default Mint;
