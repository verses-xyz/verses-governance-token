const { BigNumber } = require('ethers');
const { expect } = require("chai");

describe("Token contract", function () {
  let Token, versesToken, owner, addr1, addr2, addr3, addrs;
  const ONE = BigNumber.from("1000000000000000000");

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    versesToken = await Token.deploy(10);
    await versesToken.deployed();
  });

  describe("Deployment", function () {
    it("Should assign the initial token to the owner", async function () {
      const ownerBalance = await versesToken.balanceOf(owner.address);
      expect(await versesToken.totalSupply()).to.equal(ownerBalance);
      expect(await versesToken.owner()).to.equal(owner.address);
    });

    it("Should only mint full tokens", async function () {
      await versesToken.mint(owner.address, ONE.mul(5));
      expect(await versesToken.totalSupply()).to.equal(ONE.mul(6));
    });

    it("Should not mint fractional tokens", async function () {
      await expect(
        versesToken.mint(owner.address, ONE.div(2))
      ).to.be.revertedWith("can only mint full tokens");
    });

    it("Should not mint tokens beyond the cap", async function () {
      await expect(
        versesToken.mint(owner.address, ONE.mul(10))
      ).to.be.revertedWith("cannot mint beyond cap");
    });

    it("Should transfer tokens", async function () {
      const initialOwnerBalance = await versesToken.balanceOf(owner.address);

      // Transfer 1 token from owner to addr1
      await versesToken.transfer(addr1.address, ONE);
      const ownerBalance = await versesToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialOwnerBalance.sub(ONE));
      const addr1Balance = await versesToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ONE);

      // Transfer 1 token from addr1 to addr2
      await versesToken.connect(addr1).transfer(addr2.address, ONE);
      const addr1Balance2 = await versesToken.balanceOf(addr1.address);
      expect(addr1Balance2).to.equal(0);
      const addr2Balance = await versesToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ONE);

      // Fail to transfer 1 token from addr3 to addr2
      await expect(
        versesToken.connect(addr3).transfer(addr2.address, ONE)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should not transfer fractional tokens", async function () {
      const initialOwnerBalance = await versesToken.balanceOf(owner.address);

      await expect(
        versesToken.transfer(addr1.address, ONE.div(2))
      ).to.be.revertedWith("can only transfer full tokens");

      // balance should not change
      const ownerBalance = await versesToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialOwnerBalance);
    });
  });
});
