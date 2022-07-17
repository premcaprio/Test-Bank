import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from "ethers";
import styles from '../styles/Home.module.css'
import Modal1 from './Modal1.js';
import Modal2 from './Modal2.js';
import Modal3 from './Modal3.js';




function Index() {
  
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [accountBalances, setAccountBalances] = useState([]);
  const [listOfNames, setListOfNames] = useState([]);
  const [showModalDeposit, setShowModalDeposit] = useState(false);
  const [showModalWithdraw, setShowModalWithdraw] = useState(false);
  const [showModalTransfer, setShowModalTransfer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedBalance, setSelectedBalance] = useState("");
  const [isDeposit, setIsDeposit] = useState(true);
  const [isWithdraw, setIsWithdraw] = useState(true);
  const [isTransfer, setIsTransfer] = useState(true);
  const [amount, setAmount] = useState(0);
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");




  var vaultContractJsonHardhat = require('../../bank-contract/artifacts/contracts/Vault.sol/Vault.json');
  let abiVault = vaultContractJsonHardhat['abi'];
  let vaultAddress = "0x7bF769800fB33c28DB80a08ca8309Cd71908d15f"

  var tokenContractJsonHardhat = require('../../bank-contract/artifacts/contracts/TokenADO.sol/Cardanae.json');
  let abiToken = tokenContractJsonHardhat['abi'];
  let tokenAddress = "0x7F1a86120f9d3cAdcc76E363853F661C08B54757"


  const toWei = ether => ( ethers.utils.parseEther(ether));
  const toString = bytes32 => (ethers.utils.parseBytes32String(bytes32));
  const toEther = wei => (ethers.utils.formatEther(wei).toString());

  const getAccountBalances = async () => {

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const vault = new ethers.Contract(
          vaultAddress,
          abiVault,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const result = await vault.getBalanceMapping(currentAccount);
        console.log("fetched!");
        // setListOfNames(result[0]);
        const accountBalance = new Array();
        for(let i = 0; i < result[0].length; i++){
          accountBalance.push([result[0][i], result[1][i]]);
        };
        await setAccountBalances(accountBalance);
        setListOfNames(result[0]);
        console.log(accountBalances);
        console.log(listOfNames);
        } else {
        console.log("Metamask is not connected");
        }
      
    } catch (error) {
      console.log(error);
    }
  };

  const displayModalDeposit = (_name, _balance) => {
    setShowModalDeposit(true);
    setSelectedAccount(_name);
    setSelectedBalance(_balance);
    setIsDeposit(false);
    setIsWithdraw(false);
    setIsTransfer(false);
  }

  const displayModalWithdraw = (_name, _balance) => {
    setShowModalWithdraw(true);
    setSelectedAccount(_name);
    setSelectedBalance(_balance);
    setIsDeposit(false);
    setIsWithdraw(false);
    setIsTransfer(false);
  }

  const displayModalTransfer = (_name, _balance) => {
    setShowModalTransfer(true);
    setSenderName(_name);
    
    setSelectedAccount(_name);
    setSelectedBalance(_balance);
    setIsDeposit(false);
    setIsWithdraw(false);
    setIsTransfer(false);
  }

  const depositOrWithdrawOrTransfer = (e, account) => {
    e.preventDefault();
    
    if (isDeposit) {
      depositTokens(amount, account);
      
    } else if (isWithdraw) {
      withdrawTokens(amount, account);
      
    } else if (isTransfer) {
      transferToken(recipientName, senderName, amount);
      
    } 
  }

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onAmountChange = (event) => {
    setAmount(event.target.value);
  }

  useEffect(() => {
    let vault;
    isWalletConnected();
    getAccountBalances();

    const onNewAccount = (_name,_balance) => {
      console.log("Account created: ", _name);
      setAccountBalances((prevState) => [
        ...prevState, [_name, _balance.toNumber()]
      ]);
    };

    const {ethereum} = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      vault = new ethers.Contract(
        vaultAddress,
        abiVault,
        signer
      );

      vault.on("NewLedger", onNewAccount);
    }

    return () => {
      if (vault) {
        vault.off("NewLedger", onNewAccount);
      }
    }
  }, [])

  useEffect(() => {
    getAccountBalances();
  }, [currentAccount])

  const mintToken = async () => {

    try {

      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const token = new ethers.Contract(
          tokenAddress,
          abiToken,
          signer
        );

        console.log("Minting token...");
        const mint = await token.mint(currentAccount, toWei(amount));
        console.log(amount, "Token minted to ", currentAccount);

      } else {
        console.log("Metamask is not connected");
      }
      
    } catch (error) {
      console.log(error);
    }

  }

  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({method: 'eth_accounts'})
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
        return (true);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const depositTokens = async (_amount, _name) => {

    // _amount = 500;
    // _name = "Jason";

    try {

      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const token = new ethers.Contract(
          tokenAddress,
          abiToken,
          signer
        );
        const vault = new ethers.Contract(
          vaultAddress,
          abiVault,
          signer
        );
        console.log("deposit token...");
        const approved = await token.approve(vaultAddress, _amount);
        await approved.wait();
        console.log("mined ", approved.hash);
        console.log("Token approved");

        await vault.depositToken(_amount, _name);
        console.log("token deposited")
        
      } else {
        console.log("Metamask is not connected");
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  
  const withdrawTokens = async (_amount, _name) => {

    // _amount = 500;
    // _name = "Jason";
    if (_amount == 0) {
      alert("Please fill the valid amount.")
    } else {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const vault = new ethers.Contract(
            vaultAddress,
            abiVault,
            signer
          );
          
          console.log("Withdraw Token...")
          await vault.withdrawToken(_amount, _name);
          
          console.log("Token withdraw")
          
        } else {
          console.log("Metamask is not connected");
        }
        
      } catch (error) {
        console.log(error);
      }
    }
  }

  const transferToken = async (_recipientName, _senderName, _amount) => {

    getAccountBalances();
    getAccountBalances();
    // _recipientName = "Prem1";
    // _senderName = "Jason";
    // _amount = 500;
    if (!listOfNames.includes(_recipientName)) {
      alert('The account you want to send is invisible.')
    } else if (_recipientName == _senderName) { 
      alert('You cannot send token to yourself.')
    } else if (_amount == 0) {
      alert("Please fill the valid amount.")
    } else {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const vault = new ethers.Contract(
            vaultAddress,
            abiVault,
            signer
          );

          console.log("Transfering Token...")
          await vault.transfer(_recipientName, _senderName, _amount);
          console.log("Token transfered")
          
        } else {
          console.log("Metamask is not connected");
        }
        
      } catch (error) {
        console.log(error);
      }
    }
  }

  const createAccount = async () => {

    
    if (name.length > 0 && !(listOfNames.includes(name)) && !(/\s/.test(name))) {
      try {
        const {ethereum} = window;
        
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum, "any");
          const signer = provider.getSigner();
          const vault = new ethers.Contract(
            vaultAddress,
            abiVault,
            signer
          );
          
          console.log("Creating Account..")
          const createTransaction = await vault.createAccount(name ? name: "Jason");
          console.log("Creating Account: ", name)
          await createTransaction.wait();
  
          console.log("mined ", createTransaction.hash);
  
          console.log("Account created");
        } 
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please create the valid account name")
    }
  }

  return (
    <div className = {styles.description}>
      <header>
        {currentAccount ? (
          <div>
            <div className = {styles.code}>
              <h1 style = {{textAlign: 'left', marginTop: 20, marginLeft: 50}}>
                10X Bank
              </h1>
              <div style = {{textAlign: 'left', marginTop: 30, marginLeft: 50}}>
                <input
                  id="amount"
                  type="number"
                  onChange={onAmountChange}
                  />
                <button class = "Btn_blue_normal" onClick = {mintToken} style = {{"fontWeight":"bold"}}>
                  Mint
                </button>
              </div>

              <h2 style = {{textAlign: 'right', marginTop: -40, marginRight: 50}}>
                {currentAccount?.substring(0,10)}...
              </h2>
            </div>
            <div>
              <input
                  id="name"
                  type="text"
                  onChange={onNameChange}
                  />
              <button class = "Btn_blue_normal" onClick = {createAccount} style = {{"fontWeight":"bold"}}>
                + Create Account
              </button>
            </div>
            {(accountBalances.map((accountBalance, idx) =>  (
            
                <div style={{border:"2px solid", "borderRadius":"5px", padding: "10px", margin: "200px"}}>
                  <div key={idx}>
                    <h1 style={{"fontWeight":"bold"}}>Account: {accountBalance[0]}</h1>
                    <h3> balance: {toEther(accountBalance[1])} ADO </h3>
                  </div>
                  <div style = {{"display": "inline-block"}}>
                    <button style = {{"padding": "15px 32px"}} onClick={ () => {displayModalDeposit(accountBalance[0],toEther(accountBalance[1]))}}>Deposit Token</button>
                    <Modal1
                        show={showModalDeposit}
                        onClose= {() => setShowModalDeposit(false)}
                        account= {selectedAccount}
                        balance = {selectedBalance}
                        depositOrWithdrawOrTransfer = {depositOrWithdrawOrTransfer}
                        setIsDeposit = {setIsDeposit}
                        setAmount={setAmount}
                        toWei = {toWei}
                    />
                  </div>
                  <h3>
                  </h3>
                  <div style = {{"Display": "block"}}>
                    <button style = {{"padding": "15px 32px"}} onClick={ () => {displayModalWithdraw(accountBalance[0],toEther(accountBalance[1]))}}>Withdraw Token</button>
                    <Modal3
                        show={showModalWithdraw}
                        onClose={() => setShowModalWithdraw(false)}
                        account={selectedAccount}
                        balance = {selectedBalance}
                        depositOrWithdrawOrTransfer ={depositOrWithdrawOrTransfer}
                        setIsWithdraw={setIsWithdraw}
                        setAmount={setAmount}
                        toWei = {toWei}
                    />
                  </div>
                  <h3></h3>
                  <div style = {{"Display": "block"}}>
                    <button style = {{"padding": "15px 32px"}} onClick={ () => {displayModalTransfer(accountBalance[0],toEther(accountBalance[1]))}}>Transfer Token</button>
                    <Modal2
                        show={showModalTransfer}
                        onClose={() => setShowModalTransfer(false)}
                        name = {accountBalance[0]}
                        account = {selectedAccount}
                        balance = {selectedBalance}
                        depositOrWithdrawOrTransfer ={depositOrWithdrawOrTransfer}
                        setIsTransfer={setIsTransfer}
                        setAmount={setAmount}
                        setRecipientName = {setRecipientName}
                        toWei = {toWei}
                    />
                  </div>
                </div>
              
          )
      ))}
          </div> 
        ) : (
          <div>
            <h1 style = {{textAlign: 'left', marginTop: 20, marginLeft: 50}}>
              10X Bank
            </h1>
            <div className = {styles.container}>
              <h1>
                You are not connected 
              </h1>
              <button onClick = {connectWallet} style = {{"fontWeight":"bold"}}> Connect Metamask </button>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}


export default Index;