// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./TokenADO.sol" ;
import "@openzeppelin/contracts/utils/Strings.sol";


contract Vault {

    mapping (address => mapping(string => uint256 )) private accountBalance;
    mapping (address => mapping(string => bool )) private isCreated;
    mapping (address => string[]) private name;
    address owner;
    address tokenAddress;

    event NewLedger(
        string accountName,
        uint256 balance
    );

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor(address _tokenAddress) {
        owner == msg.sender;
        tokenAddress = _tokenAddress;
    }

    function getBalanceMapping(address _address) public view returns(string[] memory, string[] memory) {
        string[] memory nameLists = new string[](name[_address].length);
        string[] memory balance = new string[](name[_address].length);

        for (uint256 i = 0; i < name[_address].length; i++) {
            nameLists[i] = name[_address][i];
            balance[i] = Strings.toString(accountBalance[msg.sender][name[_address][i]]);
        }

        return (nameLists, balance);
    }

    function createAccount(string memory _name) public {
        require(isCreated[msg.sender][_name] == false, "The name is already used in your account");
        name[msg.sender].push(_name);

        emit NewLedger(
            _name,
            accountBalance[msg.sender][_name]
        );
    }

    function depositToken(uint256 _amount, string memory _name) external  {
        ERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        accountBalance[msg.sender][_name] += _amount;
        
    }

    function withdrawToken(uint256 _amount, string memory _name) external  {
        require(accountBalance[msg.sender][_name] >= _amount, "Have no enough token to withdrawl");
        ERC20(tokenAddress).transfer(msg.sender, _amount);
        accountBalance[msg.sender][_name] -= _amount;
    }

    function transfer(string memory recipientName, string memory senderName, uint256 _amount) external {
        require(accountBalance[msg.sender][senderName] >= _amount, "Have no enough token to transfer");
        accountBalance[msg.sender][senderName] -= _amount;
        accountBalance[msg.sender][recipientName] += _amount;
    }
}