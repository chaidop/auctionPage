import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { highestBid: 0, highestBidder: "", web3: null, accounts: null, contract: null, input: "", show_high: null  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
    const response1 = await instance.methods.highestBid.call();
    const response2 = await instance.methods.highestBidder.call();
    // Update state with the result.
    this.setState({ highestBid: response1, highestBidder: response2 });
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, highestBid: response1, highestBidder: response2});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
 
myChangeHandler = (event) => {
        this.setState({input: event.target.value}, ()=>{
        console.log(this.state.input)
        });
}


  /*runExample = async () => {
    const { accounts, contract } = this.state;
        console.log("hi");
    console.log(accounts);
    // Stores a given value, 5 by default.
    await contract.methods.set(this.state.input).send({from: accounts[0]});

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ highestBid: response });
  };*/

 clicked_bid = async () => {
    const { accounts, contract, web3 } = this.state;

    // Stores a given value, state.input.
    await contract.methods.bid().send({from: accounts[0], value: web3.utils.toWei(this.state.input)});

    // Get the value from the contract to prove it worked.
    const response1 = await contract.methods.highestBid.call();
	const response2 = await contract.methods.highestBidder.call();
    // Update state with the result.
    this.setState({ highestBid: response1, highestBidder: response2 });
  };
  
   clicked_withdraw = async () => {
    const { accounts, contract } = this.state;

    await contract.methods.withdraw().send({from: accounts[0]});

    const response1 = await contract.methods.highestBid.call();
	const response2 = await contract.methods.highestBidder.call();
    // Update state with the result.
    this.setState({ highestBid: response1, highestBidder: response2});
  };

clicked_highestBid = async () => {
    const  contract  = this.state.contract;

    const response1 = await contract.methods.highestBid().call();
    console.log(response1);
    
    // Update state with the result.
    this.setState({ highestBid: response1, show_high: response1});
  };

clicked_highestBidder = async () => {
    const  contract  = this.state.contract;

    const response1 = await contract.methods.highestBidder().call();
    console.log(response1);
    // Update state with the result.
    this.setState({ highestBidder: response1, show_high: response1});
  };
  
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
	let sh
	if(this.state.show_high == null){
		sh = <div>Highest Bid: 0, Highest Bidder: NONE </div>
	}
	else{
	  const cc = this.state.contract;
	  this.state.highestBid = cc.methods.getHighestBid();
	  this.state.highestBid = cc.methods.getHighestBidder();
	  this.clicked_highestBid();
	  this.clicked_highestBidder();
	  sh = <div>Highest Bid: {this.state.highestBid}, Highest Bidder: {this.state.highestBidder} </div>
	}
	/*let show_highest
	if(this.state.highestBid == null || this.state.highestBidder == null){
		show_highest = ""
	}
	else{
		show_highest = <div><div>Highest Bid:{this.state.highestBid}</div>
		</div>
	}*/
console.log(Number(this.state.highestBid));
    return (
      <div className="App">
        <h1>Welcome to the world's best Auction!</h1>
        <p>Bid and withdraw to your hearts content :).</p>
        <h2>Select what to do:</h2>
        <p>
          Make a bid
        </p>
		<input type="text" onChange={this.myChangeHandler}/>
        <button onClick={this.clicked_bid}>BID</button>
        <p>
          Withdraw bid
        </p>
        <button onClick={this.clicked_withdraw}>WITHDRAW</button>
        <div>
        <button onClick={this.clicked_highestBid}>Highest Bid</button>
	</div>
	 <div>
        <button onClick={this.clicked_highestBidder}>Highest Bidder</button>
        </div>
	<div>
	{sh}
	</div>
      </div>
    );
  }
}
 
export default App;
