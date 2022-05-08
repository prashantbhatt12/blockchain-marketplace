import React, { useRef } from "react";
const AirDropCoins = ({ onOwnerAirDropClicked }) => {
  const airdropAddr = useRef("");
  const airdropAmount = useRef(0);
  const onAirDropSubmittedHandler = (event) => {
    event.preventDefault();
    const amountInWei = window.web3.utils.toWei(
      airdropAmount.current.value.toString(),
      "Ether"
    );
    onOwnerAirDropClicked(airdropAddr.current.value, amountInWei);
  };
  return (
    <>
      <div className="d-flex flex-column">
        <div className="p-2 bd-highlight">
          <p>&nbsp;</p>
          <h1 className="text-center">Air Drop money</h1>
          <form className="w-50 mx-auto" onSubmit={onAirDropSubmittedHandler}>
            <div className="mb-2 justify-content-center">
              <input
                id="airdrop-address"
                type="text"
                className="form-control"
                placeholder="Address"
                required
                ref={airdropAddr}
              />
            </div>
            <div className="form-group mr-sm-2 mb-2">
              <input
                id="airdrop-amount"
                type="number"
                className="form-control"
                placeholder="Amount"
                required
                ref={airdropAmount}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Air Drop
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AirDropCoins;
