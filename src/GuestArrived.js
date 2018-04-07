import React from 'react';
import Web3 from 'web3';
import TimeIsMoneyContract from '../build/contracts/TimeIsMoney.json';
import { BigNumber } from 'bignumber.js';

const GuestArrived = props => (
  <div>
    { callContract(getParam(props, 'guestAddress'), getParam(props, 'privateSeed')) }
    <h2>Confirm Guest Arrived!</h2>
  </div>
)

function getParam(props, attribute) {
  const search = props.location.search;
  const params = new URLSearchParams(search);
  const attributeValue = params.get(attribute);

  console.log({ attributeValue })

  return attributeValue;
}

function callContract(guestAddress, privateSeed) {
  const functionSignature = '0x307c0b15';
  const firstParam = guestAddress.slice(2).padStart(64, '0');
  const secondParam = convertSeedToHex(privateSeed);
  const transaction = {
    to: TimeIsMoneyContract['networks']['5777'].address,
    gas: 43383,
    data: `${functionSignature}${firstParam}${secondParam}`
  };

  //const etherUrl = `https://rinkeby.infura.io/${process.env.INFURA_API_KEY}`;
  const etherUrl = "http://localhost:8545";
  const web3 = new Web3(new Web3.providers.HttpProvider(etherUrl));

  web3.eth.accounts.signTransaction(transaction, process.env.REACT_APP_PRIVATE_KEY);
}

function convertSeedToHex(privateSeed) {
  const hexNumber = BigNumber(privateSeed).toString(16);
  return hexNumber.padStart(64, '0');
}

export default GuestArrived;
