const { assert } = require("chai");

describe("DanToken", function() {
  const totalSupply = ethers.utils.parseEther("10000");
  let deployerSigner, deployerAddress;
  let token, dex;
  before(async () => {
    const DanToken = await ethers.getContractFactory("DanToken");
    token = await DanToken.deploy(totalSupply);
    await token.deployed();

    const DanDex = await ethers.getContractFactory("DanDEX");
    dex = await DanDex.deploy(token.address);
    await dex.deployed();

    deployerSigner = ethers.provider.getSigner(0);
    deployerAddress = await deployerSigner.getAddress();
  });

  it("should mint us some tokens", async function() {
    const balance = await token.balanceOf(deployerAddress);

    assert.equal(balance.toString(), totalSupply.toString());
  });

  describe('transfer tokens to a new address', () => {
    const amount = ethers.utils.parseEther("999");
    let newAddress = "0x30baf2fcb7a0e3e1177702451cb730746664f4d6";
    before(async () => {
      await token.transfer(newAddress, amount);
    });

    it("should add the balance to the newAddress", async () => {
      const balance = await token.balanceOf(newAddress);

      assert(balance.toString(), amount.toString());
    });

    it("should subtract the balance from the deployer", async () => {
      const balance = await token.balanceOf(deployerAddress);

      assert(balance.toString(), totalSupply.sub(amount).toString());
    });
  });

  describe("depositing into the dan dex", () => {
    const amount = ethers.utils.parseEther("100");
    it("should not allow a deposit initially", async () => {
      let ex;
      try {
        await dex.deposit(amount);
      }
      catch(_ex) {
        ex = _ex;
      }
      assert(ex.message.indexOf("revert ERC20") >= 0, "expected this transaction to REVERT");
    });

    describe("approve first", () => {
      before(async () => {
        await token.approve(dex.address, amount);
      });

      it("should set the allowance", async () => {
        const allowance = await token.allowance(deployerAddress, dex.address);

        assert.equal(allowance.toString(), amount.toString());
      });

      it("should allow us to deposit now", async () => {
        await dex.deposit(amount);

        const balance = await token.balanceOf(dex.address);
        assert.equal(balance.toString(), amount.toString());
      });
    });
  });
});
