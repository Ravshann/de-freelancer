import { useState } from "react";

import "./App.css";
import { BrowserRouter } from 'react-router-dom';


import ConnectWalletButton from "./components/ConnectWalletButton";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  const onPressConnect = async () => {
    setLoading(true);
    try {
      const downloadMetamaskUrl = "https://metamask.io/download.html";
      if (window?.ethereum?.isMetaMask) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => setAddress(res[0]));
      } else {
        window.open(downloadMetamaskUrl);
      }
    } catch (error) {
      console.log(error);
      setAddress("");
    }
    setLoading(false);
  };

  return (
    <>
      <BrowserRouter>
        {
          address !== "" ?
            <Dashboard address={address} />
            :
            <header className="App-header">
              <ConnectWalletButton
                onPressConnect={onPressConnect}
                address={address}
                loading={loading}
              />
            </header>
        }
      </BrowserRouter>
    </>

  );
};

export default App;
