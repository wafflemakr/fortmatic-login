import React, { useState, useEffect } from "react";

import "./App.css";

let web3;

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loginFortmatic, setLoginFortmatic] = useState(false);
  const [loginMetamask, setLoginMetamask] = useState(false);
  const [loginPortis, setLoginPortis] = useState(false);

  async function getAccount() {
    await web3.currentProvider.enable();
    let account = await web3.eth.getCoinbase();
    let balance = await web3.eth.getBalance(account);
    setUser({ account, balance });
  }

  useEffect(() => {
    if (loginFortmatic) {
      (async function() {
        try {
          let fm = new window.Fortmatic(
            process.env.REACT_APP_FORTMATIC_API_KEY
          );
          web3 = new window.Web3(fm.getProvider());
          await getAccount();
        } catch (e) {
          setError("Error:" + e.message);
        }
      })();
    }
  }, [loginFortmatic]);

  useEffect(() => {
    if (loginMetamask) {
      (async function() {
        try {
          web3 = new window.Web3(window.ethereum);
          await window.ethereum.enable();
          await getAccount();
        } catch (e) {
          setError("Error:" + e.message);
        }
      })();
    }
  }, [loginMetamask]);

  useEffect(() => {
    if (loginPortis) {
      (async function() {
        try {
          const portis = new window.Portis(
            process.env.REACT_APP_PORTIS_DAPP_ID,
            "rinkeby"
          );
          web3 = new window.Web3(portis.provider);
          await getAccount();
        } catch (e) {
          setError("Error:" + e.message);
        }
      })();
    }
  }, [loginPortis]);

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
        <button className="login" onClick={() => setLoginFortmatic(true)}>
          Connect with Fortmatic
        </button>
        <button className="login" onClick={() => setLoginMetamask(true)}>
          Connect with Metamask
        </button>
        <button className="login" onClick={() => setLoginPortis(true)}>
          Connect with Portis
        </button>
      </div>
    </div>
  );
}

export default App;
