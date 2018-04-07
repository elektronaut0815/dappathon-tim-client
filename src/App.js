import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import { BigNumber } from 'bignumber.js';
import TimeIsMoneyContract from '../build/contracts/TimeIsMoney.json';
import getWeb3 from './utils/getWeb3';

import Web3Utils from 'web3-utils';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

const SERVER_IP = '192.168.178.85:3000/guest-arrived';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showQRCode: false,
            guestAddress: '',
            privateSeed: '',
            web3: null
        };
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
                });
            })
            .catch(() => {
                console.log('Error finding web3.');
            });
    }

    render() {
        return (
            <div className="App">
                <nav className="navbar pure-menu pure-menu-horizontal">
                    <a href="#" className="pure-menu-heading pure-menu-link">
                        Truffle Box
                    </a>
                </nav>

                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <div className="center">
                                <div className="ticketPrice">
                                    Ticket Price: 0.1 Ether
                                </div>
                                <button onClick={this.buyTicket}>
                                    Buy Ticket
                                </button>
                                {this.state.showQRCode && (
                                    <div className="qrcode">
                                        <QRCode
                                            value={this.generateQRCodeURI()}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    generateQRCodeURI() {
        const baseUri = `http://${SERVER_IP}`;
        const object = this.getQRCodeDataObject();
        return encodeURI(`${baseUri}?guestAddress=${object.guestAddress}&privateSeed=${object.privateSeed}`);
    }

    getQRCodeDataObject() {
        return {
            guestAddress: this.state.guestAddress,
            privateSeed: this.state.privateSeed
        };
    }

    buyTicket() {
        const contract = require('truffle-contract');
        const tim = contract(TimeIsMoneyContract);
        tim.setProvider(this.state.web3.currentProvider);

        let timInstance;

        this.state.web3.eth.getAccounts((error, accounts) => {
            let privateSeed, hashOfSeed;
            tim
                .deployed()
                .then(instance => {
                    timInstance = instance;

                    BigNumber.config({ CRYPTO: true });
                    BigNumber.config({ EXPONENTIAL_AT: 38 });
                    privateSeed = BigNumber.random(37).multipliedBy(10e37);
                    hashOfSeed = Web3Utils.soliditySha3(privateSeed);
                    privateSeed = privateSeed.toString();

                    return timInstance.buyTicket(hashOfSeed, {
                        value: this.state.web3.utils.toWei('0.1', 'ether'),
                        from: accounts[0]
                    });
                })
                .then(() => {
                    this.setState({
                        showQRCode: true,
                        guestAddress: accounts[0],
                        privateSeed
                    });
                });
        });
    }
}

export default App;
