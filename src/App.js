import React, { useState, useEffect } from "react";

import "./App.css";
import Torus from "@toruslabs/torus-embed";

let web3;

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(null);

  async function getAccount() {
    await web3.currentProvider.enable();
    let account = await web3.eth.getCoinbase();
    let balance = await web3.eth.getBalance(account);
    setUser({ account, balance });
  }

  useEffect(() => {
    (async function() {
      try {
        switch (login) {
          case "Fortmatic": {
            let fm = new window.Fortmatic(
              process.env.REACT_APP_FORTMATIC_API_KEY
            );
            web3 = new window.Web3(fm.getProvider());
            await getAccount();
            break;
          }
          case "Portis": {
            const portis = new window.Portis(
              process.env.REACT_APP_PORTIS_DAPP_ID,
              "rinkeby"
            );
            web3 = new window.Web3(portis.provider);
            await getAccount();
            break;
          }

          case "Metamask": {
            web3 = new window.Web3(window.ethereum);
            await window.ethereum.enable();
            await getAccount();
            break;
          }
          case "Torus": {
            const torus = new Torus();
            await torus.init();
            await torus.login(); // await torus.ethereum.enable()
            web3 = new window.Web3(torus.provider);
            sessionStorage.setItem("pageUsingTorus", true);
            await getAccount();
            break;
          }
          default:
            return null;
        }
      } catch (e) {
        setError("Error:" + e.message);
      }
    })();
  }, [login]);

  const renderInfo = user ? (
    <>
      <p>Connected to: {user.account || null}</p>
      <p>Balance: {web3.utils.fromWei(user.balance)} ETH</p>
    </>
  ) : null;

  const renderError = error ? <h1>{error}</h1> : null;

  return (
    <div>
      <div className="container">
        {renderInfo}
        {renderError}
        <button className="login" onClick={() => setLogin("Fortmatic")}>
          Connect with Fortmatic
        </button>
        <button className="login" onClick={() => setLogin("Metamask")}>
          Connect with Metamask
        </button>
        <button className="login" onClick={() => setLogin("Portis")}>
          Connect with Portis
        </button>
        <button className="login" onClick={() => setLogin("Torus")}>
          Connect with Torus
        </button>
      </div>
    </div>
  );
}

export default App;
