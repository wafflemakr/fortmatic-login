import React, { useState, useEffect } from "react";

let fm = new window.Fortmatic(process.env.REACT_APP_FORTMATIC_API_KEY);
const web3 = new window.Web3(fm.getProvider());

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async function execute() {
      try {
        await web3.currentProvider.enable();
        let account = await web3.eth.getCoinbase();
        let balance = await web3.eth.getBalance(account);
        setUser({ account, balance });
      } catch (e) {
        setError("Error:" + e.message);
      }
    })();
  }, [user]);

  return user ? (
    <>
      <h1>Connected to: {user.account || null}</h1>
      <h1>Balance: {web3.utils.fromWei(user.balance)} ETH</h1>
    </>
  ) : error ? (
    <h1>{error}</h1>
  ) : (
    <h1>Connecting...</h1>
  );
}

export default App;
