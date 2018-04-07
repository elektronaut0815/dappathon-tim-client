import React from 'react';
import Web3 from 'web3';
import TimeIsMoneyContract from '../build/contracts/TimeIsMoney.json';
import { BigNumber } from 'bignumber.js';

class GuestArrived extends React.Component {
  constructor(props) {
    super(props);

    this.state = { txHash: '' };

    this.getParam = this.getParam.bind(this);
    this.callContract = this.callContract.bind(this);
  }

  render() {
    return (
      <div>
        { this.state.txHash &&
          <div>
            <h2>Guest Has Arrived! See transaction!</h2>
            <h3>See transaction:</h3>
            <a href={ `https://rinkeby.etherscan.io/tx/${this.state.txHash}` }>{ `https://rinkeby.etherscan.io/tx/${this.state.txHash}` }</a>
          </div>
        }
        { !this.state.txHash && <h2>Submitting transaction...</h2> }
      </div>
    );
  }

  componentDidMount() {
    this.callContract(this.getParam('guestAddress'), this.getParam('privateSeed'))
  }

  getParam(attribute) {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const attributeValue = params.get(attribute);

    return attributeValue;
  }

  callContract(guestAddress, privateSeed) {
    const functionSignature = '0x307c0b15';
    const firstParam = guestAddress.slice(2).padStart(64, '0');
    const secondParam = convertSeedToHex(privateSeed);
    const transaction = {
      to: TimeIsMoneyContract['networks']['5777'].address,
      gas: 43383,
      data: `${functionSignature}${firstParam}${secondParam}`
    };

    // const etherUrl = `https://rinkeby.infura.io/${process.env.INFURA_API_KEY}`;
    const etherUrl = "http://localhost:8545";
    const web3 = new Web3(new Web3.providers.HttpProvider(etherUrl));

    web3.eth.accounts.signTransaction(transaction, process.env.REACT_APP_PRIVATE_KEY)
        .then(result => this.setState({ txHash: result.messageHash }))
  }
}

function convertSeedToHex(privateSeed) {
  const hexNumber = BigNumber(privateSeed).toString(16);
  return hexNumber.padStart(64, '0');
}

export default GuestArrived;
