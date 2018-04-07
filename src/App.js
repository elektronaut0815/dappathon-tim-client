import React, { Component } from 'react'
import QRCode from 'qrcode.react';
import {BigNumber} from 'bignumber.js';
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import Web3Utils from 'web3-utils';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const SERVER_IP = '0.0.0.0'; // TODO

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showQRCode: false,
      publicKey: '',
      privSeed: '',
      web3: null
    }
    this.buyTicket = this.buyTicket.bind(this);
    this.getQRCodeDataObject = this.getQRCodeDataObject.bind(this);
    this.generateQRCodeURI = this.generateQRCodeURI.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <div className="center">
                <div className="ticketPrice">
                  Ticket Price: 0.1 Ether
                </div>
                <button onClick={this.buyTicket}>Buy Ticket</button>
                { this.state.showQRCode &&
                  <div className="qrcode">
                    <QRCode value={ this.generateQRCodeURI() } />
                  </div>
                }
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  generateQRCodeURI() {
    const baseUri = `http://${SERVER_IP}`;
    const objectString = JSON.stringify(this.getQRCodeDataObject());
    return encodeURI(`${baseUri}/?query=${objectString}`);
  }

  getQRCodeDataObject() {
    return {
      publicKey: this.state.publicKey,
      privSeed: this.state.privSeed
    };
  }

  buyTicket() {
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    let simpleStorageInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      let privSeed, hashOfSeed;
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        BigNumber.config({ CRYPTO: true });
        BigNumber.config({ EXPONENTIAL_AT: 38 })
        privSeed = BigNumber.random(37).multipliedBy(10e37);
        hashOfSeed = Web3Utils.soliditySha3(privSeed);
        privSeed = privSeed.toString();

        return simpleStorageInstance.buyTicket(hashOfSeed, {
          value: this.state.web3.toWei(0.1, 'ether'),
          from: accounts[0]
        })
      }).then(() => {
        this.setState({ showQRCode: true, publicKey: accounts[0], privSeed })
      })
    })
  }
}

export default App
