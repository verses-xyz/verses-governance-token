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

    it("Should revert when trying to mint fractional tokens", async function () {
      await expect(
        versesToken.mint(owner.address, ONE.div(2))
      ).to.be.revertedWith("can only mint full tokens");
    });

    it("Should revert when trying to mint tokens beyond the cap", async function () {
      await expect(
        versesToken.mint(owner.address, ONE.mul(10))
      ).to.be.revertedWith("cannot mint beyond cap");
    });

    it("Should allow owner to be transferred", async function () {
      const initialOwnerBalance = await versesToken.balanceOf(owner.address);

      await versesToken.transferOwnership(addr1.address);
      expect(versesToken.owner === addr1.address);

      await expect(
          versesToken.pause()
      ).to.be.revertedWith("only owner can pause")
      await versesToken.connect(addr1).transferOwnership(addr2.address);
      expect(versesToken.owner === addr2.address);
    });

    it("Should only allow owner to pause or unpause", async function () {
      const initialOwnerBalance = await versesToken.balanceOf(owner.address);

      // only owner can pause
      await expect(
        versesToken.connect(addr1).pause()
      ).to.be.revertedWith("only owner can pause")
      expect(!versesToken.paused);
      await versesToken.pause();
      expect(versesToken.paused);
      await expect(
        versesToken.transfer(addr2.address, ONE)
      ).to.be.revertedWith("paused");

      // only owner can unpause
      await expect(
        versesToken.connect(addr1).unpause()
      ).to.be.revertedWith("only owner can unpause")
      expect(versesToken.paused);
      await versesToken.unpause();
      expect(!versesToken.paused);

      // token has been transfered
      await versesToken.transfer(addr1.address, ONE);
      const ownerBalance = await versesToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialOwnerBalance.sub(ONE));
      const addr1Balance = await versesToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ONE);
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

    it("Should revert when trying to transfer fractional tokens", async function () {
      const initialOwnerBalance = await versesToken.balanceOf(owner.address);

      await expect(
        versesToken.transfer(addr1.address, ONE.div(2))
      ).to.be.revertedWith("can only transfer full tokens");

      const ownerBalance = await versesToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialOwnerBalance);
    });
  });
});
