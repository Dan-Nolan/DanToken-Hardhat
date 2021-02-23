//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

interface DanToken2 {
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract DanDEX {
  DanToken2 danToken;

  constructor(address addr) {
    danToken = DanToken2(addr);
  }

  // first approve that the DanDEX can spend your DanTokens
  function deposit(uint amount) external {
    danToken.transferFrom(msg.sender, address(this), amount);
  }
}
